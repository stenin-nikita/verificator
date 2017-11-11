import {
    Locale,
    Message,
    Messages,
    Collection,
    MessageParameters,
} from './types'
import is from './helpers/is'
import flattenData from './helpers/flattenData'

export default class Translator {
    protected _locale: string
    protected _messages: Collection<Message>
    protected _attributes: Collection<string>
    protected _customMessages: Collection<Message>
    protected _customAttributes: Collection<string>

    constructor(locale: Locale, messages?: Messages, attributes?: Collection<string>) {
        this.setLocale(locale)
        this.setCustomMessages(messages)
        this.setCustomAttributes(attributes)
    }

    public setLocale(locale: Locale) {
        this._locale = locale.name
        this._messages = flattenData(locale.messages)
        this._attributes = locale.attributes || {}
    }

    public setCustomMessages(messages?: Messages): this {
        this._customMessages = {}

        return this.addCustomMessages(messages)
    }

    public addCustomMessages(messages?: Messages): this {
        this._customMessages = {
            ...this._customMessages,
            ...flattenData(messages || {}),
        }

        return this
    }

    public setCustomAttributes(attributes?: Collection<string>): this {
        this._customAttributes = {}

        return this.addCustomAttributes(attributes)
    }

    public addCustomAttributes(attributes?: Collection<string>): this {
        this._customAttributes = {
            ...this._customAttributes,
            ...(attributes || {}),
        }

        return this
    }

    public getMessage(rule: string, attribute: string, value: any, parameters: any[], type: string): string {
        for (let messages of [this._customMessages, this._messages]) {
            let message = this._findMessage(messages, { rule, attribute, value, parameters }, type)

            if (message !== null) {
                return message
            }
        }

        return `Invalid value for field "${attribute}"`
    }

    public getAttribute(attribute: string): string|null {
        if (attribute in this._customAttributes) {
            return this._customAttributes[attribute]
        }

        if (attribute in this._attributes) {
            return this._attributes[attribute]
        }

        return null
    }

    protected _findMessage(source: Collection<Message>, parameters: MessageParameters, type: string): string|null {
        const keys = [
            `${parameters.attribute}.${parameters.rule}:${type}`,
            `${parameters.attribute}.${parameters.rule}`,
            `${parameters.rule}:${type}`,
            parameters.rule,
        ]

        for (let key of keys) {
            for (let sourceKey of Object.keys(source)) {
                if (is(sourceKey, key)) {
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
}
