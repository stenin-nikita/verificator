import isIP from 'validator/lib/isIP'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return isIP(value, 4)
}

export default validate
