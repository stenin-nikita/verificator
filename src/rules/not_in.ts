import validateIn from './in'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return ! validateIn(attribute, value, parameters, validator)
}

export default validate