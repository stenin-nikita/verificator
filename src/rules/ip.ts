import isIP from 'validator/lib/isIP'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return isIP(value)
}

export default validate