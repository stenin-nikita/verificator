import requireParameterCount from './helpers/requireParameterCount'
import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(2, parameters, 'required_if')

    const other = validator.getValue(parameters[0])
    let values = parameters.slice(1)

    if (typeof other === 'boolean') {
        values = values.map(val => (val === 'true') ? true : ((val === 'false') ? false : val))
    }

    if (values.indexOf(other) > -1) {
        return required(attribute, value, parameters, validator)
    }

    return true
}

export default validate
