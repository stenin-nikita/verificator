import parseDate from '../helpers/parseDate'
import isValid from 'date-fns/isValid'

const compareDates = (attribute: string, date: any, parameters: string[], operator: string): boolean => {
    if (typeof date !== 'string' || !isValid(date)) {
        return false
    }

    return compare(Number(parameters[0]), Number(date), operator)
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

export default compareDates