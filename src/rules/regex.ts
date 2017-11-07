import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'regex')

    const [ regex ] = parameters

    return new RegExp(regex).test(String(value))
}

export default validate