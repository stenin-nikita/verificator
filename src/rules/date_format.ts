import requireParameterCount from '../helpers/requireParameterCount'
import parseDate from '../helpers/parseDate'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'date_format')

    const [ format ] = parameters

    return !!parseDate(value, format)
}

export default validate