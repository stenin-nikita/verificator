import isValid from 'date-fns/isValid'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (value instanceof Date && !isNaN(Number(value))) {
        return true
    }

    if (typeof value !== 'string' && typeof value !== 'number' || !isValid(value)) {
        return false
    }

    return true
}

export default validate
