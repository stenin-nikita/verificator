import dataGet from '../helpers/dataGet'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const val = dataGet(validator.getData(), attribute, '__MISSING__')

    return val !== '__MISSING__'
}

export default validate
