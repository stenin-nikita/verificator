import parseDate from 'date-fns/parse'
import toDate from 'date-fns/toDate'
import parseTime from '../helpers/parseTime'

const compareDates = (attribute: string, value: any, [ date ]: any[], operator: string, validator: any): boolean => {
    if (value instanceof Date || typeof value == 'string' || typeof value == 'number') {

        const now = new Date()
        const format = getDateFormat(attribute, validator)
        
        date = validator.getValue(date) || date

        const first = format ? parseDate(String(value), String(format), now) : toDate(parseTime(value, now))
        const second = format ? parseDate(String(date), String(format), now) : toDate(parseTime(date, now))
    
        return compare(Number(first), Number(second), operator)
    }

    return false
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

const getDateFormat = (attribute: string, validator: any): string|null => {
    let rule = validator.getRule(attribute, 'date_format')

    if (rule) {
        const { parameters: [ format ] } = rule

        return typeof format === 'string' && format ? format : null
    }

    return null
}

export default compareDates