import { anyFailingRequired } from '../helpers/failingRequired'
import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (anyFailingRequired(parameters, validator)) {
        return required(attribute, value, parameters, validator)
    }

    return true
}

export default validate