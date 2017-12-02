import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (validator.getValue(attribute, '__MISSING__') !== '__MISSING__') {
        return required(attribute, value, [], validator)
    }

    return true
}

export default validate
