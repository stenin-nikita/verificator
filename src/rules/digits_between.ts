import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(2, parameters, 'digits_between')

    const [ min, max ] = parameters
    const str = String(value)
    
    return /^[0-9]*$/.test(str) && str.length >= Number(min) && str.length <= Number(max)
}

export default validate