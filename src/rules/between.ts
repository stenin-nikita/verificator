import requireParameterCount from '../helpers/requireParameterCount'
import getSize from '../helpers/getSize'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(2, parameters, 'between')

    const [ min, max ] = parameters
    const size = getSize(attribute, value, validator)

    return size >= Number(min) && size <= Number(max)
}

export default validate
