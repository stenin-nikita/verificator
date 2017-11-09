import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'digits')

    const [ length ] = parameters
    const str = String(value)

    return /^[0-9]*$/.test(str) && str.length === Number(length)
}

export default validate
