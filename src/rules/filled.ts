import required from './required'
import dataGet from '../helpers/dataGet'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (dataGet(validator.getData(), attribute, '__MISSING__') !== '__MISSING__') {
        return required(attribute, value, [], validator)
    }

    return true
}

export default validate