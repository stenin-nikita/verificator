import parseDate from 'date-fns/parse'
import toDate from 'date-fns/toDate'
import getDateFormat from './getDateFormat'
import parseTime from './parseTime'
import compare from './compare'

const compareDates = (attribute: string, value: any, [ date ]: any[], operator: string, validator: any): boolean => {
    if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {

        const now = new Date()
        const format = getDateFormat(attribute, validator)

        date = validator.getValue(date) || date

        const first = format ? parseDate(String(value), String(format), now) : toDate(parseTime(value, now))
        const second = format ? parseDate(String(date), String(format), now) : toDate(parseTime(date, now))

        return compare(Number(first), Number(second), operator)
    }

    return false
}

export default compareDates
