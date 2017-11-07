import {
    Rule,
    Rules,
    InputRule,
    InputRules,
    ValidationData,
    ImplicitAttributes,
    ValidationRuleParserInterface
} from './interfaces'
import dataGet from './helpers/dataGet'

export default class ValidationRuleParser implements ValidationRuleParserInterface {
    public data: ValidationData

    public rules: Rules = {}

    public implicitAttributes: ImplicitAttributes = {}

    constructor(data: ValidationData) {
        this.data = data
    }

    parse(rules: InputRules): this {
        this.rules = {}
        this.implicitAttributes = {}

        Object.keys(rules).forEach(attribute => {
            this._explodeRules(attribute, [attribute, rules[attribute]])
        })

        return this
    }

    /**
     * Private methods
     */
    protected _explodeRules(attribute: string, rule: [string, InputRule]) {
        if (attribute.indexOf('*') > -1) {
            this._explodeWildcardRules(attribute, rule)
        } else {
            const [name, rules] = rule
    
            this.rules[attribute] = this._parseRules(rules)
    
            if (name.indexOf('*') > -1) {
                this.implicitAttributes[name] = this.implicitAttributes[name] || []
                this.implicitAttributes[name].push(attribute)
            }
        }
    }

    protected _explodeWildcardRules(attribute: string, rule: [string, InputRule]) {
        const path = attribute.substr(0, attribute.indexOf('*') - 1)
        const value = dataGet(this.data, path)
    
        if (value) {
            if (Array.isArray(value)) {
                value.forEach((v, i) => {
                    this._explodeRules(String(attribute).replace('*', String(i)), rule)
                })
            } else if (Object.prototype.toString.call(value) === '[object Object]') {
                Object.keys(value).forEach(key => {
                    this._explodeRules(String(attribute).replace('*', key), rule)
                })
            }
        }
    }

    protected _parseRules(rules: InputRule): Rule[] {
        if (typeof rules === 'string') {
            rules = rules.split('|')
        }
    
        return rules.filter(rule => (Array.isArray(rule) || typeof rule === 'string') && rule.length).map(rule => this._parseRule(rule))
    }

    protected _parseRule(rule: string|any[]): Rule {
        if (Array.isArray(rule)) {
            return {
                name: rule[0].trim(),
                parameters: rule.slice(1)
            }
        }
        
        const name = rule.indexOf(':') > -1 ? rule.substr(0, rule.indexOf(':')) : rule
        const parameter = rule.indexOf(':') > -1 ? rule.substr(rule.indexOf(':') + 1) : []
        const parameters = this._parseParameters(name, parameter)
    
        return {
            name: name.trim(),
            parameters
        }
    }

    protected _parseParameters(rule: string, parameter: string|any[]): string[] {
        if (Array.isArray(parameter)) {
            return parameter
        }

        if (rule.toLowerCase() === 'regex') {
            return [ parameter ]
        }
    
        return parameter.split(',')
    }
}