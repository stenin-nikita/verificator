import parseDate from '../helpers/parseDate'
import isValid from 'date-fns/isValid'
import toDate from 'date-fns/toDate'

const compareDates = (attribute: string, value: any, [ date ]: any[], operator: string, validator: any): boolean => {
    if (typeof value !== 'string' || !isValid(value)) {
        return false
    }

    // let format = getDateFormat(attribute, validator)
    let first = toDate(value)
    let second = toDate(date)

    return compare(Number(first), Number(second), operator)
}

const compare = (first: number, second: number, operator: string) => {
    switch (operator) {
        case '<':
            return first < second
        case '>':
            return first > second
        case '<=':
            return first <= second
        case '>=':
            return first >= second
        case '=':
            return first == second
        default:
            throw new TypeError()
    }
}

// const getDateFormat = (attribute: string, validator: any): string => {
//     let result = validator.getRule(attribute, 'date_format')

//     if (result) {
//         return result[1][0]
//     }
// }

export default compareDates