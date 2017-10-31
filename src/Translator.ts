export default class Translator {
    protected _locale: string
    protected _messages: any
    protected _attributes: any

    constructor(locale: any) {
        this._locale = locale.name
        this._messages = locale.messages
        this._attributes = locale.attributes
    }

    getMessage(rule: string, attribute: string, value: any, parameters: any[], type: string) {
        if (rule in this._messages) {
            let trans = this._messages[rule]

            if (typeof trans === 'function') {
                return trans({ attribute, value, rule, parameters })
            }

            if (type in trans) {
                return trans[type]({ attribute, value, rule, parameters })
            }
        }

        return `The rule "${rule}" failed on ${attribute}`
    }

    getAttribute(attribute: string) {
        const attributes = this._attributes

        return attributes[attribute]
    }
}