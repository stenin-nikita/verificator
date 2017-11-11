import {
    Locale,
    LocaleMessage,
    LocaleMessages,
    LocaleMessageParameters,
} from './types'
import is from './helpers/is'
import flattenData from './helpers/flattenData'

export default class Translator {
    protected _locale: string
    protected _messages: { [key: string]: LocaleMessage }
    protected _attributes: { [key: string]: string }
    protected _customMessages: { [key: string]: LocaleMessage }
    protected _customAttributes: { [key: string]: string }

    constructor(locale: Locale, messages: LocaleMessages = {}, attributes: { [key: string]: string } = {}) {
        this.setLocale(locale)
        this.setCustomMessages(messages)
        this.setCustomAttributes(attributes)
    }

    public setLocale(locale: Locale) {
        this._locale = locale.name
        this._messages = flattenData(locale.messages || {})
        this._attributes = locale.attributes || {}
    }

    public setCustomMessages(messages: LocaleMessages = {}): this {
        this._customMessages = {}

        return this.addCustomMessages(messages)
    }

    public addCustomMessages(messages: LocaleMessages = {}): this {
        this._customMessages = {
            ...this._customMessages,
            ...flattenData(messages),
        }

        return this
    }

    public setCustomAttributes(attributes: { [key: string]: string } = {}): this {
        this._customAttributes = {}

        return this.addCustomAttributes(attributes)
    }

    public addCustomAttributes(attributes: { [key: string]: string } = {}): this {
        this._customAttributes = {
            ...this._customAttributes,
            ...attributes,
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

    protected _findMessage(source: { [key: string]: LocaleMessage }, parameters: LocaleMessageParameters, type: string): string|null {
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
