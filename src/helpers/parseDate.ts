import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'
import formatDate from 'date-fns/format'

const parseDate = (date: string | Date, format: string): null|Date => {
    if (typeof date !== 'string') {
        return isValid(date) ? date : null;
    }

    const parsed = parse(date, format, new Date())

    if (!isValid(parsed) || formatDate(parsed, format) !== date) {
        return null;
    }
    
    return parsed
}

export default parseDate