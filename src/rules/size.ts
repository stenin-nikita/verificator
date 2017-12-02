import requireParameterCount from './helpers/requireParameterCount'
import getSize from './helpers/getSize'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'size')

    const [ size ] = parameters

    const type = typeof value

    if (['number', 'string'].indexOf(type) === -1 && !Array.isArray(value)) {
        return false
    }

    return getSize(attribute, value, validator) === Number(size)
}

export default validate
