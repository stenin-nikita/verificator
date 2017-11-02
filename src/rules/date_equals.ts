import requireParameterCount from '../helpers/requireParameterCount'
import compareDates from '../helpers/compareDates'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'date_equals')

    return compareDates(attribute, value, parameters, '=', validator)
}

export default validate