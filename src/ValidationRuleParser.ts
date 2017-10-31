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
    
        if (value && Array.isArray(value)) {
            value.forEach((v, i) => {
                this._explodeRules(attribute.replace('*', String(i)), rule)
            })
        }
    }

    protected _parseRules(rules: InputRule): Rule[] {
        if (typeof rules === 'string') {
            rules = rules.split('|')
        }
    
        return rules.map(rule => this._parseRule(rule))
    }

    protected _parseRule(rule: string): Rule {
        const [ name, parameter ] = rule.split(':')
    
        const parameters = typeof parameter === 'string' ? this._parseParameters(name, parameter) : []
    
        return {
            name: name.trim(),
            parameters
        }
    }

    protected _parseParameters(rule: string, parameter: string): string[] {
        if (rule.toLowerCase() === 'regex') {
            return [ parameter ]
        }
    
        return parameter.split(',')
    }
}