import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    // TODO
    requireParameterCount(1, parameters, 'in_array')
    
    return parameters.filter(parameter => parameter == value).length > 0
}

export default validate