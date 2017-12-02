export default function requireParameterCount(count: number, parameters: any[], rule: string) {
    if (parameters.length < count) {
        throw new Error(`Validation rule ${rule} requires at least ${count} parameters.`)
    }
}
