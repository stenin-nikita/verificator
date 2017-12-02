import requireParameterCount from './helpers/requireParameterCount'
import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(2, parameters, 'required_unless')

    const data = validator.getValue(parameters[0])
    const values = parameters.slice(1)

    if (values.indexOf(data) === -1) {
        return required(attribute, value, parameters, validator)
    }

    return true
}

export default validate
