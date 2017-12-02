import get from '../utils/get'
import isPlainObject from '../utils/isPlainObject'
import { SET_RULES } from '../constants/types'
import { Items, Rule } from '../types'

const parseParameters = (rule: string, parameter: string|any[]): any[] => {
    if (Array.isArray(parameter)) {
        return parameter
    }

    if (rule.toLowerCase() === 'regex') {
        return [ parameter ]
    }

    return parameter.split(',')
}

const parseRule = (rule: string|any[]): Rule => {
    if (Array.isArray(rule)) {
        return {
            name: rule[0].trim(),
            parameters: rule.slice(1),
        }
    }

    const name = rule.indexOf(':') > -1 ? rule.substr(0, rule.indexOf(':')) : rule
    const parameter = rule.indexOf(':') > -1 ? rule.substr(rule.indexOf(':') + 1) : []
    const parameters = parseParameters(name, parameter)

    return {
        name: name.trim(),
        parameters,
    }
}

const parseRules = (rules: string|string[]): Rule[] => {
    if (typeof rules === 'string') {
        rules = rules.split('|')
    }

    return rules.filter(rule => (Array.isArray(rule) || typeof rule === 'string') && rule.length).map(parseRule)
}

export const setRules = (data: Items, initialRules: Items<string|string[]>) => {
    const _rules: Items<Rule[]> = {}
    const _attributes: Items<string[]> = {}

    function explodeRules(attribute: string, rule: [string, string|string[]]) {
        if (attribute.indexOf('*') > -1) {
            const path = attribute.substr(0, attribute.indexOf('*') - 1)
            const value = get(data, path)

            if (value) {
                if (Array.isArray(value)) {
                    value.forEach((v, i) => {
                        explodeRules(attribute.replace('*', String(i)), rule)
                    })
                } else if (isPlainObject(value)) {
                    Object.keys(value).forEach(key => {
                        explodeRules(attribute.replace('*', key), rule)
                    })
                }
            }
        } else {
            const [name, rules] = rule

            _rules[attribute] = parseRules(rules)

            if (name.indexOf('*') > -1) {
                _attributes[name] = _attributes[name] || []
                _attributes[name].push(attribute)
            }
        }
    }

    Object.keys(initialRules).forEach(attribute => {
        explodeRules(attribute, [attribute, initialRules[attribute]])
    })

    return {
        type: SET_RULES,
        payload: {
            initialRules,
            rules: _rules,
            implicitAttributes: _attributes,
        },
    }
}
