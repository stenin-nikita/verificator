export interface Items<T = any> {
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

export interface Messages extends Items<Message|Messages> {}

export interface Locale {
    messages: Messages
    attributes: Items<string>
    customMessages?: Messages
    customAttributes?: Items<string>
}

export interface CustomLocale {
    messages?: Messages,
    attributes?: Items<string>
}

export interface DataState extends Items {}
export interface ErrorsState extends Items<string[]> {}
export interface ImplicitAttributesState extends Items<string[]> {}
export interface InitialRulesState extends Items<string|string[]> {}
export interface ParsedRulesState extends Items<Rule[]> {}
export interface ValidatingState extends Items<boolean> {}

export interface IState {
    data: DataState
    errors: ErrorsState
    implicitAttributes: ImplicitAttributesState
    initialRules: InitialRulesState
    rules: ParsedRulesState
    validating: ValidatingState
}
