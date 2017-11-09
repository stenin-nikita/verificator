import isEmail from 'validator/lib/isEmail'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return isEmail(String(value))
}

export default validate
