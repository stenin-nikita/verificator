import {
    Rule,
    Rules,
    InputRules,
    ValidationData,
    ErrorBagInterface,
    ValidatorInterface,
    ImplicitAttributes,
} from './types'
import deepmerge from 'deepmerge'
import dataGet from './helpers/dataGet'
import dataSet from './helpers/dataSet'
import escapeString from './helpers/escapeString'
import ValidationRuleParser from './ValidationRuleParser'
import Translator from './Translator'
import ErrorBag from './ErrorBag'
import defaultRules from './rules'

const dependentRules = [
    'required_with', 'required_with_all', 'required_without',
    'required_without_all', 'required_if', 'required_unless',
    'confirmed', 'same', 'different', 'before', 'after',
    'before_or_equal', 'after_or_equal',
]

const defaultLocale = {
    name: 'default',
    messages: {}
}

let RULES = defaultRules
let LOCALE = defaultLocale

export default class Validator implements ValidatorInterface {
    protected _data: ValidationData

    protected _rules: Rules

    protected _initialRules: InputRules

    protected _implicitAttributes: ImplicitAttributes

    protected _translator: Translator

    protected _errors: ErrorBagInterface

    protected _RULES: any

    public static make(data: ValidationData, rules: InputRules, locale: any = LOCALE): Validator {
        return new Validator(data, rules, locale)
    }

    public static setLocale(locale?: any) {
        LOCALE = locale || defaultLocale
    }

    public static extend(name: string, func: Function) {
        if (typeof func !== 'function') {
            throw new TypeError(`The validator of rule '${name}' must be a function`)
        }

        RULES[name] = func
    }

    constructor(data: ValidationData, rules: InputRules, locale: any = LOCALE) {
        this._translator = new Translator(locale)
        this._data = this._parseData(data)

        this.setRules(rules)

        this._errors = new ErrorBag()
        this._RULES = { ...defaultRules }
    }

    get errors(): ErrorBagInterface {
        return this._errors
    }

    public passes(name?: string): Promise<boolean> {
        this._errors = new ErrorBag()

        const promises: Promise<boolean>[] = []
        const attributes = this._filterAttributes(name)

        if (name && attributes.length === 0) {
            return Promise.reject(new Error(`Validating a non-existent attribute: "${name}".`))
        }

        for (let attribute of attributes) {
            const rules = this._rules[attribute]

            for (let rule of rules) {
                const promise = this._validateAttribute(attribute, rule)

                promises.push(promise)
            }
        }

        return Promise.all(promises).then(results => results.every(result => result))
    }

    public setData(data: ValidationData): this {
        this._data = this._parseData(data)
        this.setRules(this._initialRules)

        return this
    }

    public getData(): ValidationData {
        return this._data
    }

    public setRules(rules: InputRules): this {
        this._initialRules = rules
        this._rules = {}

        this.addRules(rules)

        return this
    }

    public addRules(rules: InputRules): this {
        this._initialRules = deepmerge(this._initialRules || {}, rules)

        const response = (new ValidationRuleParser(this._data)).parse(this._initialRules)

        this._rules = response.rules,
        this._implicitAttributes = response.implicitAttributes

        return this
    }

    public getRules(): Rules {
        return this._rules
    }

    public hasRule(attribute: string, rules: string|string[]): boolean {
        return this.getRule(attribute, rules) !== null
    }

    public getRule(attribute: string, rules: string|string[]): Rule|null {
        if (! (attribute in this._rules)) {
            return null
        }

        if (typeof rules === 'string') {
            rules = [rules]
        }

        for (let rule of this._rules[attribute]) {
            const { name } = rule

            if (rules.indexOf(name) > -1) {
                return rule
            }
        }

        return null
    }

    public getValue(attribute: string): any {
        return dataGet(this._data, attribute)
    }

    public getPrimaryAttribute(attribute: string): string {
        for (let unparsed of Object.keys(this._implicitAttributes)) {
            if (this._implicitAttributes[unparsed].indexOf(attribute) > -1) {
                return unparsed
            }
        }

        return attribute
    }

    public setLocale(locale?: any): this {
        this._translator = new Translator(locale || defaultLocale)

        return this
    }

    public extend(name: string, func: Function): this {
        if (typeof func !== 'function') {
            throw new TypeError(`The validator of rule '${name}' must be a function`)
        }

        this._RULES[name] = func

        return this
    }

    /**
     * Private methods
     */
    protected _filterAttributes(name?: string): string[] {
        let attributes = Object.keys(this._rules)

        if (typeof name === 'string' && name.length > 0) {
            if (name.indexOf('*') > -1) {
                const regex = new RegExp(`^${escapeString(name).replace(/\\\*/g, '([^\.]+)')}$`)

                attributes = attributes.filter(attr => regex.test(attr))
            } else {
                attributes = attributes.filter(attr => attr === name)
            }
        }

        return attributes
    }

    protected _validateAttribute(attribute: string, rule: Rule): Promise<boolean> {
        let { name, parameters } = rule
        const value = this.getValue(attribute)

        const keys = this._getExplicitKeys(attribute)

        if (keys.length && dependentRules.indexOf(name) > -1) {
            parameters = this._replaceAsterisksInParameters(parameters, keys)
        }

        const validate = RULES[name]

        if (validate) {
            const promise = Promise.resolve(validate(attribute, value, parameters, this))

            promise.then(valid => {
                if (!valid) {
                    this._addFailure(name, attribute, value, parameters)
                }

                return valid
            })

            return promise
        }

        return Promise.reject(new Error(`The ${name} rule is not defined`))
    }

    protected _parseData(data: any): any {
        let newData: any

        if (Array.isArray(data)) {
            newData = []

            data.forEach(value => newData.push(this._parseData(value)))
        } else if (Object.prototype.toString.call(data) === '[object Object]') {
            newData = {}

            Object.keys(data).forEach(key => {
                let value = data[key]

                if (typeof value === 'object' && value !== null) {
                    value = this._parseData(value)
                }

                if (key.indexOf('.') > -1) {
                    dataSet(newData, key, value)
                } else if (key in newData) {
                    newData[key] = {
                        ...newData[key],
                        ...value,
                    }
                } else {
                    newData[key] = value
                }
            })
        } else {
            return data
        }

        return newData
    }

    protected _getExplicitKeys(attribute: string): string[] {
        const pattern = escapeString(this.getPrimaryAttribute(attribute))
            .replace(/\\\*/g, '([^\.]+)')
        const regex = new RegExp(`^${pattern}`)
        const match = regex.exec(attribute)

        if (match) {
            match.shift()

            return match.slice(0)
        }

        return []
    }

    protected _replaceAsterisksInParameters(parameters: string[], keys: string[]): string[] {
        return parameters.map(field => {
            keys.forEach(key => {
                field = field.replace('*', key)
            })

            return field
        })
    }

    protected _addFailure(rule: string, attribute: string, value: any, parameters: any[]) {
        parameters = this._getDisplayableParameters(rule, parameters)

        const message = this._translator.getMessage(
            rule, this._getDisplayableAttribute(attribute), value, parameters, this._getAttributeType(attribute),
        )

        this._errors.add(attribute, message)
    }

    protected _getDisplayableAttribute(attribute: string): string {
        const primaryAttribute = this.getPrimaryAttribute(attribute)
        const expectedAttributes = attribute !== primaryAttribute ? [attribute, primaryAttribute] : [attribute]

        for (let name of expectedAttributes) {
            const line = this._translator.getAttribute(name)

            if (line) {
                return line
            }
        }

        if (primaryAttribute in this._implicitAttributes) {
            return attribute
        }

        return String(attribute).replace(/_/g, ' ')
    }

    protected _getDisplayableParameters(rule: string, parameters: any[]): any[] {
        if (dependentRules.indexOf(rule) > -1) {
            return parameters.map(parameter => this._getDisplayableAttribute(parameter))
        }

        return parameters
    }

    protected _getAttributeType(attribute: string): string {
        if (this.hasRule(attribute, ['numeric', 'integer'])) {
            return 'numeric'
        } else if (this.hasRule(attribute, ['array'])) {
            return 'array'
        }

        return 'string'
    }
}
