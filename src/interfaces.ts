export interface Rule {
    name: string
    parameters: any[]
}

export interface Rules {
    [key: string]: Rule[]
}

export type InputRule = string | string[]

export interface InputRules {
    [key: string]: InputRule
}

export interface ImplicitAttributes {
    [key: string]: string[]
}

export interface ValidationData {
    [key: string]: any
}

export interface ValidationRuleParserInterface {
    data: ValidationData
    rules: Rules
    implicitAttributes: ImplicitAttributes

    parse(rules: InputRules): this
}

export interface ValidatorInterface {
    passes(): Promise<boolean>

    setData(data: ValidationData): this
    
    getData(): ValidationData

    setRules(rules: InputRules): this

    addRules(rules: InputRules): this

    getRules(): Rules

    hasRule(attribute: string, rules: string|string[]): boolean

    getRule(attribute: string, rules: string|string[]): Rule|null

    getValue(attribute: string): any

    errors(): any
}

export interface ValidateOptions {
    rules: { [key: string]: Function }
    rule: string
    attribute: string
    value: any,
    parameters: any[]
    validator: ValidatorInterface
}