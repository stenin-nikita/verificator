import { setData, setRules, startValidate, stopValidate } from './actions'
import { DEPENDENT_RULES, DEFAULT_LOCALE } from './constants'
import DEFAULT_RULES from './rules'
import deepmerge from 'deepmerge'
import reducer from './reducer'
import { createStore, applyMiddleware, Store } from 'redux'
import ErrorBag from './ErrorBag'
import Translator from './Translator'
import * as utils from './utils'
import { IState, Rule, Items, Locale, Messages } from './types'

let RULES = DEFAULT_RULES
let LOCALE = DEFAULT_LOCALE

export default class Validator {
    protected _store: Store<IState>

    protected _translator: Translator

    protected _errors: ErrorBag

    protected _listeners: Function[] = []

    protected _rules: Items<Function> = {}

    public static useLocale(locale?: Locale) {
        LOCALE = locale || DEFAULT_LOCALE
    }

    public static extend(name: string, validate: Function) {
        if (typeof validate !== 'function') {
            throw new TypeError(`The rule [${name}] must be a function`)
        }

        RULES[name] = validate
    }

    constructor(data: Items, rules: Items<string|string[]>, customLocale: any = {}) {
        this._store = createStore<IState>(reducer, applyMiddleware(store => next => action => {
            const result = next(action)

            this._listeners.forEach(listener => listener(action.type))

            return result
        }))

        this._store.dispatch(setData(data || {}))
        this.setRules(rules)

        this._errors = new ErrorBag(this._store)
        this._translator = new Translator({
            ...LOCALE,
            customMessages: customLocale.messages || {},
            customAttributes: customLocale.attributes || {},
        }, this)
    }

    get errors(): ErrorBag {
        return this._errors
    }

    public isValidating(attribute?: string): boolean {
        const { validating } = this._store.getState()

        if (attribute) {
            return Boolean(validating[attribute])
        }

        return Object.keys(validating).some(key => validating[key])
    }

    public validateAll(): Promise<boolean> {
        const { rules } = this._store.getState()
        const attributes = Object.keys(rules)

        this.errors.clear()

        const promises: Promise<boolean>[] = []

        for (let attribute of attributes) {
            promises.push(this.validate(attribute))
        }

        return Promise.all(promises).then(results => results.every(result => result))
    }

    public validate(attribute: string): Promise<boolean> {
        if (this.isValidating(attribute) || !this._passesOptionalCheck(attribute)) {
            return Promise.resolve(true)
        }

        this._store.dispatch(startValidate(attribute))

        if (this._errors.has(attribute)) {
            this._errors.remove(attribute)
        }

        const { rules } = this._store.getState()

        let queue: ((result: boolean) => boolean|Promise<boolean>)[] = []

        for (let rule of rules[attribute]) {
            queue.push(((a, r) => {
                return (result: boolean): boolean|Promise<boolean> => {
                    if (result === true) {
                        return this._validateRule(a, r)
                    }

                    return result
                }
            })(attribute, rule))
        }

        return queue.reduce((promise, queueFn) => promise.then(queueFn), Promise.resolve(true)).then(result => {
            this._store.dispatch(stopValidate(attribute))

            return result
        })
    }

    public setData(data: Items<any>): this {
        const { initialRules } = this._store.getState()

        this._store.dispatch(setData(data || {}))
        this.setRules(initialRules)

        return this
    }

    public getData(): Items<any> {
        const { data } = this._store.getState()

        return data
    }

    public getValue(attribute: string, defaultValue?: any): any {
        const { data } = this._store.getState()

        return utils.get(data, attribute, defaultValue)
    }

    public setRules(rules: Items<string|string[]>): this {
        const { data } = this._store.getState()

        this._store.dispatch(setRules(data, rules || {}))

        return this
    }

    public addRules(rules: Items<string|string[]>): this {
        const { initialRules } = this._store.getState()

        this.setRules(deepmerge(initialRules, rules))

        return this
    }

    public getRules(): Items<Rule[]> {
        const { rules } = this._store.getState()

        return rules
    }

    public getPrimaryAttribute(attribute: string): string {
        const { implicitAttributes } = this._store.getState()

        for (let unparsed of Object.keys(implicitAttributes)) {
            if (implicitAttributes[unparsed].indexOf(attribute) > -1) {
                return unparsed
            }
        }

        return attribute
    }

    public subscribe(listener: Function): Function {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
        let isListener = true
        this._listeners.push(listener)

        return () => {
            if (isListener === false) {
                return
            }

            isListener = false

            const index = this._listeners.indexOf(listener)
            this._listeners.splice(index, 1)
        }
    }

    public getRule(attribute: string, target: string|string[]): Rule|null {
        const { rules } = this._store.getState()

        if (! (attribute in rules)) {
            return null
        }

        if (typeof target === 'string') {
            target = [target]
        }

        for (let rule of rules[attribute]) {
            const { name } = rule

            if (target.indexOf(name) > -1) {
                return rule
            }
        }

        return null
    }

    public hasRule(attribute: string, target: string|string[]): boolean {
        return this.getRule(attribute, target) !== null
    }

    public extend(name: string, validate: Function): this {
        if (typeof validate !== 'function') {
            throw new TypeError(`The rule [${name}] must be a function`)
        }

        this._rules[name] = validate

        return this
    }

    public getImplicitAttributes(): Items<string[]> {
        const { implicitAttributes } = this._store.getState()

        return implicitAttributes
    }

    public setCustomMessages(messages?: Messages): this {
        this._translator.setCustomMessages(messages)

        return this
    }

    public addCustomMessages(messages?: Messages): this {
        this._translator.addCustomMessages(messages)

        return this
    }

    public setAttributeNames(attributes?: Items<string>): this {
        this._translator.setCustomAttributes(attributes)

        return this
    }

    public addAttributeNames(attributes?: Items<string>): this {
        this._translator.addCustomAttributes(attributes)

        return this
    }

    protected _validateRule(attribute: string, rule: Rule): Promise<boolean> {
        const value = this.getValue(attribute)
        const { name } = rule
        const parameters = this._replaceAsterisksInParameters(rule, attribute)

        const validate = this._rules[name] || RULES[name]

        if (validate) {
            return Promise.resolve(validate(attribute, value, parameters, this)).then(result => {
                if (result === false) {
                    const message = this._translator.getMessage(name, attribute, value, parameters)
                    this._errors.add(attribute, message)
                }

                return result
            })
        }

        return Promise.reject(new Error(`The rule [${name}] does not exist`))
    }

    protected _passesOptionalCheck(attribute: string): boolean {
        if (!this.hasRule(attribute, 'sometimes')) {
            return true
        }

        return this.getValue(attribute, '__MISSING__') !== '__MISSING__'
    }

    protected _replaceAsterisksInParameters(rule: Rule, attribute: string): any[] {
        const { name, parameters } = rule

        if (DEPENDENT_RULES.indexOf(name) === -1) {
            return parameters
        }

        const pattern = utils.escape(this.getPrimaryAttribute(attribute)).replace(/\\\*/g, '([^\.]+)')
        const regex = new RegExp(`^${pattern}`)
        const match = regex.exec(attribute)

        if (match) {
            match.shift()

            const keys = match.slice(0)

            return parameters.map(field => {
                if (typeof field === 'string') {
                    keys.forEach(key => {
                        field = field.replace('*', key)
                    })
                }

                return field
            })
        }

        return parameters
    }
}
