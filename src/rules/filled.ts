import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    // TODO
    if (validator.hasAttribute(attribute)) {
        return required(attribute, value, parameters, validator)
    }

    return true
}

export default validate