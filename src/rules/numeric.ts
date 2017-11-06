import isNumeric from '../helpers/isNumeric'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return isNumeric(value)
}

export default validate