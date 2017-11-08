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

export interface ErrorBagInterface {
    add(key: string, message: string): this

    clear(key?: string): this

    first(key: string): string

    has(key: string): boolean

    get(key: string): string[]

    all(): string[]

    any(): boolean

    count(): number
}

export interface ValidatorInterface {
    readonly errors: ErrorBagInterface

    passes(name?: string): Promise<boolean>

    setData(data: ValidationData): this
    
    getData(): ValidationData

    setRules(rules: InputRules): this

    addRules(rules: InputRules): this

    getRules(): Rules

    hasRule(attribute: string, rules: string|string[]): boolean

    getRule(attribute: string, rules: string|string[]): Rule|null

    getValue(attribute: string): any

    getPrimaryAttribute(attribute: string): string
}