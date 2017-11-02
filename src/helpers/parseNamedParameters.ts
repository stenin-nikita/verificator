const parseNamedParameters = (parameters: string[]): { [key: string]: any } => {
    const result = {}

    parameters.forEach(item => {
        const [ key, value ] = item.split('=')
        result[key] = value
    })

    return result
}

export default parseNamedParameters