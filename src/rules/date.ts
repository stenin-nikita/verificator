import isValid from 'date-fns/isValid'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (typeof value === 'boolean') {
        return false
    }

    return isValid(value)
}

export default validate