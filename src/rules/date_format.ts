import requireParameterCount from './helpers/requireParameterCount'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'date_format')

    if (typeof value !== 'string' && typeof value !== 'number') {
        return false
    }

    const [ format ] = parameters
    const date = parseDate(String(value), String(format), new Date())

    return date && formatDate(date, format) === value
}

export default validate
