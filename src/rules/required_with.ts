import { allFailingRequired } from '../helpers/failingRequired'
import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (!allFailingRequired(parameters, validator)) {
        return required(attribute, value, parameters, validator)
    }

    return true
}

export default validate
