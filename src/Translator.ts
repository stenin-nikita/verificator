export default class Translator {
    protected _locale: string
    protected _messages: any
    protected _attributes: any
    protected _customMessages: any
    protected _customAttributes: any

    constructor(locale: any, customMessages: any = {}, customAttributes: any = {}) {
        this._locale = locale.name
        this._messages = locale.messages
        this._attributes = locale.attributes

        this._customMessages = customMessages
        this._customAttributes = customAttributes
    }

    public getMessage(rule: string, attribute: string, value: any, parameters: any[], type: string) {
        const customMessage = this._getMessage(this._customMessages, rule, attribute, value, parameters, type)

        if (customMessage) {
            return customMessage
        }

        const message = this._getMessage(this._messages, rule, attribute, value, parameters, type)

        if (message) {
            return message
        }

        return `Invalid value for field "${attribute}"`
    }

    public getAttribute(attribute: string) {
        const attributes = this._attributes

        return attributes[attribute]
    }

    protected _getMessage(messages: any, rule: string, attribute: string, value: any, parameters: any[], type: string): string|null {
        if (rule in messages) {
            let trans = messages[rule]

            if (typeof trans === 'function') {
                return trans({ attribute, value, rule, parameters })
            }

            if (type in trans) {
                return trans[type]({ attribute, value, rule, parameters })
            }
        }

        return null
    }
}
