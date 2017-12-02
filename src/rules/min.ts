import requireParameterCount from './helpers/requireParameterCount'
import getSize from './helpers/getSize'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'min')

    const [ min ] = parameters

    return getSize(attribute, value, validator) >= Number(min)
}

export default validate
