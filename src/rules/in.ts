import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'in')

    if (Array.isArray(value) && validator.hasRule(attribute, 'array')) {
        for(let element of value) {
            if (Array.isArray(element)) {
                return false
            }
        }

        return value.filter(v => parameters.indexOf(v) == -1).length == 0
    }

    return !Array.isArray(value) && parameters.indexOf(String(value)) > -1
}

export default validate