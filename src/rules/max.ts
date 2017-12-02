import requireParameterCount from './helpers/requireParameterCount'
import getSize from './helpers/getSize'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'max')

    const [ max ] = parameters

    return getSize(attribute, value, validator) <= Number(max)
}

export default validate
