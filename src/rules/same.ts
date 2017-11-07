import requireParameterCount from '../helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'same')

    const [ other ] = parameters

    return value === validator.getValue(other)
}

export default validate