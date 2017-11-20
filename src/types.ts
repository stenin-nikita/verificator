export interface Collection<T> {
    [key: string]: T
}

export interface Rule {
    name: string
    parameters: any[]
}

export interface MessageParameters {
    rule: string
    attribute: string
    value: any
    parameters: any[]
}

export type Message = string|((parameters: MessageParameters) => string)

export interface Messages {
    [key: string]: Message | Messages
}

export interface Locale {
    name: string
    messages: Messages,
    attributes?: Collection<string>
}

export interface ValidationRuleParserInterface {
    data: Collection<any>
    rules: Collection<Rule[]>
    implicitAttributes: Collection<string[]>

    parse(rules: Collection<string|string[]>): this
}

export interface ErrorBagInterface {
    add(key: string, message: string): ErrorBagInterface

    remove(key: string): ErrorBagInterface

    clear(): ErrorBagInterface

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

    setData(data: Collection<any>): this

    getData(): Collection<any>

    setRules(rules: Collection<string|string[]>): this

    addRules(rules: Collection<string|string[]>): this

    getRules(): Collection<Rule[]>

    hasRule(attribute: string, rules: string|string[]): boolean

    getRule(attribute: string, rules: string|string[]): Rule|null

    getValue(attribute: string): any

    getPrimaryAttribute(attribute: string): string

    extend(name: string, func: Function): this

    setCustomMessages(messages: Messages): this

    addCustomMessages(messages: Messages): this

    setAttributeNames(attributes: Collection<string>): this

    addAttributeNames(attributes: Collection<string>): this
}
