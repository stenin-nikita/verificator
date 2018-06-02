import { DEPENDENT_RULES } from './constants'
import * as utils from './utils'
import Validator from './Validator'
import { Items, Locale, Message, MessageParameters, Messages } from './types'

export default class Translator {
    protected _validator: Validator

    protected _messages: Items<Message>

    protected _attributes: Items<string>

    protected _customMessages: Items<Message>

    protected _customAttributes: Items<string>

    constructor(locale: Locale, validator: Validator) {
        this._validator = validator

        this.setLocale(locale)
        this.setCustomMessages(locale.customMessages || {})
        this.setCustomAttributes(locale.customAttributes || {})
    }

    public setLocale(locale: Locale): this {
        this._messages = utils.flatten(locale.messages)
        this._attributes = locale.attributes || {}

        return this
    }

    public getAttribute(attribute: string): string|null {
        const { _attributes, _customAttributes } = this

        if (attribute in _customAttributes) {
            return _customAttributes[attribute]
        }

        if (attribute in _attributes) {
            return _attributes[attribute]
        }

        return null
    }

    public getMessage(rule: string, attribute: string, value: any, parameters: any[]): string {
        const { _messages, _customMessages } = this
        const rawAttribute = attribute

        attribute = this._getDisplayableAttribute(attribute)
        parameters = this._getDisplayableParameters(rule, parameters)

        for (let source of [_customMessages, _messages]) {
            let message = this._findMessage(source, rawAttribute, { rule, attribute, value, parameters })

            if (message !== null) {
                return message
            }
        }

        return `Invalid value for field "${attribute}"`
    }

    public setCustomMessages(messages?: Messages): this {
        this._customMessages = utils.flatten(messages || {})

        return this
    }

    public addCustomMessages(messages?: Messages): this {
        this._customMessages = {
            ...this._customMessages,
            ...utils.flatten(messages || {}),
        }

        return this
    }

    public setCustomAttributes(attributes?: Items<string>): this {
        this._customAttributes = attributes || {}

        return this
    }

    public addCustomAttributes(attributes?: Items<string>): this {
        this._customAttributes = {
            ...this._customAttributes,
            ...(attributes || {}),
        }

        return this
    }

    protected _findMessage(source: Items<string|Function>, attribute: string, parameters: MessageParameters): string|null {
        const type = this._getAttributeType(attribute)

        const keys = [
            `${attribute}.${parameters.rule}:${type}`,
            `${attribute}.${parameters.rule}`,
            `${parameters.rule}:${type}`,
            parameters.rule,
        ]

        for (let key of keys) {
            for (let sourceKey of Object.keys(source)) {
                if (utils.is(sourceKey, key)) {
                    const message = source[sourceKey]

                    if (typeof message === 'string') {
                        return message
                    }

                    if (typeof message === 'function') {
                        return message(parameters)
                    }

                    return null
                }
            }
        }

        return null
    }

    protected _getDisplayableAttribute(attribute: string): string {
        const implicitAttributes = this._validator.getImplicitAttributes()
        const primaryAttribute = this._validator.getPrimaryAttribute(attribute)

        const expectedAttributes = attribute !== primaryAttribute ? [attribute, primaryAttribute] : [attribute]

        for (let name of expectedAttributes) {
            const line = this.getAttribute(name)

            if (line !== null) {
                return line
            }
        }

        if (primaryAttribute in implicitAttributes) {
            return attribute
        }

        return attribute.toLowerCase().replace(/_/g, ' ')
    }

    protected _getDisplayableParameters(rule: string, parameters: any[]): any[] {
        if (DEPENDENT_RULES.indexOf(rule) > -1) {
            return parameters.map(parameter => this._getDisplayableAttribute(parameter))
        }

        return parameters
    }

    protected _getAttributeType(attribute: string): string {
        if (this._validator.hasRule(attribute, ['numeric', 'integer'])) {
            return 'numeric'
        } else if (this._validator.hasRule(attribute, ['array'])) {
            return 'array'
        }

        return 'string'
    }
}
