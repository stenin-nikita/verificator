import {
    Rule,
    Rules,
    InputRules,
    ValidationData,
    ValidatorInterface,
    ImplicitAttributes
} from './interfaces'
import deepmerge from 'deepmerge'
import dataGet from './helpers/dataGet'
import dataSet from './helpers/dataSet'
import escapeString from './helpers/escapeString'
import isFile from './helpers/isFile'
import ValidationRuleParser from './ValidationRuleParser'
import Translator from './Translator'
import ErrorBag from './ErrorBag'
import RULES from './rules'

const dependentRules = [
    'required_with', 'required_with_all', 'required_without',
    'required_without_all', 'required_if', 'required_unless',
    'confirmed', 'same', 'different', 'before', 'after',
    'before_or_equal', 'after_or_equal',
]

const implicitRules = [
    'required', 'filled', 'required_with', 'required_with_all', 'required_without',
    'required_without_all', 'required_if', 'required_unless', 'accepted', 'present',
]

export default class Validator implements ValidatorInterface {
    protected _data: ValidationData

    protected _rules: Rules

    protected _initialRules: InputRules

    protected _implicitAttributes: ImplicitAttributes

    protected _translator: Translator

    protected _errors: ErrorBag

    constructor(data: ValidationData, rules: InputRules, locale: any) {
        this._translator = new Translator(locale)
        this._data = this._parseData(data)

        this.setRules(rules)
    }

    passes(): Promise<boolean> {
        this._errors = new ErrorBag()

        const promises: Promise<boolean>[] = []

        for(let attribute of Object.keys(this._rules)) {
            const rules = this._rules[attribute]

            for(let rule of rules) {
                const promise = this._validateAttribute(attribute, rule)

                promise
                promises.push(promise)
            }
        }

        return Promise.all(promises).then(results => results.every(result => result))
    }

    setData(data: ValidationData): this {
        this._data = this._parseData(data)
        this.setRules(this._initialRules)
    
        return this
    }
    
    getData(): ValidationData {
        return this._data
    }

    setRules(rules: InputRules): this {
        this._initialRules = rules
        this._rules = {}

        this.addRules(rules)

        return this
    }

    addRules(rules: InputRules): this {
        this._initialRules = deepmerge(this._initialRules || {}, rules)

        const response = (new ValidationRuleParser(this._data)).parse(this._initialRules)

        this._rules = response.rules,
        this._implicitAttributes = response.implicitAttributes

        return this
    }

    getRules(): Rules {
        return this._rules
    }

    hasRule(attribute: string, rules: string|string[]): boolean {
        return this.getRule(attribute, rules) !== null
    }

    getRule(attribute: string, rules: string|string[]): Rule|null {
        if (! (attribute in this._rules)) {
            return null
        }

        if (typeof rules === 'string') {
            rules = [rules]
        }
    
        for(let rule of this._rules[attribute]) {
            const { name, parameters } = rule

            if (rules.indexOf(name) > -1) {
                return rule
            }
        }

        return null
    }

    getValue(attribute: string): any {
        return dataGet(this._data, attribute)
    }

    errors(): any {
        return this._errors
    }

    getPrimaryAttribute(attribute: string): string {
        for(let unparsed of Object.keys(this._implicitAttributes)) {
            if (this._implicitAttributes[unparsed].indexOf(attribute) > -1) {
                return unparsed
            }
        }
    
        return attribute
    }

    static make(data: ValidationData, rules: InputRules, translator: any): Validator {
        return new Validator(data, rules, translator)
    }

    /**
     * Private methods
     */
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
        } else if (isFile(data) || (/string|number|boolean/).test(typeof data)) {
            return data
        } else {
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
                        ...value
                    }
                } else {
                    newData[key] = value
                }
            })
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
            rule,
            this._getDisplayableAttribute(attribute),
            value,
            parameters,
            this._getAttributeType(attribute)
        )

        this._errors.add(attribute, message)
    }

    protected _getDisplayableAttribute(attribute: string): string {
        const primaryAttribute = this.getPrimaryAttribute(attribute)
        const expectedAttributes = attribute != primaryAttribute ? [attribute, primaryAttribute] : [attribute]

        for(let name of expectedAttributes) {
            const line = this._translator.getAttribute(name)

            if (line) {
                return line
            }
        }

        if (primaryAttribute in this._implicitAttributes) {
            return attribute
        }

        return attribute.replace(/_/g, ' ')
    }

    protected _getDisplayableParameters(rule: string, parameters: any[]): any[] {
        if (dependentRules.indexOf(rule)) {
            return parameters.map(parameter => this._getDisplayableAttribute(parameter))
        }

        return parameters
    }

    protected _getAttributeType(attribute: string): string {
        if (this.hasRule(attribute, ['numeric', 'integer'])) {
            return 'numeric'
        } else if (this.hasRule(attribute, ['array'])) {
            return 'array'
        } else if (isFile(this.getValue(attribute))) {
            return 'file'
        }

        return 'string'
    }

    // protected _isValidatable(rule: string, attribute: string, value: any): boolean {
    //     return this._presentOrRuleIsImplicit(rule, attribute, value) &&
    //            this._passesOptionalCheck(attribute) &&
    //            this._isNotNullIfMarkedAsNullable(rule, attribute)
    // }

    // protected _presentOrRuleIsImplicit(rule: string, attribute: string, value: any): boolean {
    //     if (typeof value === 'string' && value.trim() === '') {
    //         return implicitRules.indexOf(rule) > -1
    //     }

    //     return RULES.present(attribute, value, [], this) || implicitRules.indexOf(rule) > -1
    // }

    // protected _isNotNullIfMarkedAsNullable(rule: string, attribute: string): boolean {
    //     if (implicitRules.indexOf(rule) > -1 || !this.hasRule(attribute, ['nullable'])) {
    //         return true
    //     }
        
    //     return dataGet(this._data, attribute, 0) != null
    // }

    // protected _passesOptionalCheck(attribute: string): boolean {
    //     if (!this.hasRule(attribute, ['sometimes'])) {
    //         return true
    //     }
        
    //     return false
    //     // $data = ValidationData::initializeAndGatherData($attribute, $this->data);
        
    //     // return array_key_exists($attribute, $data) || in_array($attribute, array_keys($this->data));
    // }
}