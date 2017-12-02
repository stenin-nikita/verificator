import requireParameterCount from './helpers/requireParameterCount'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'different')

    for (let parameter of parameters) {
        const other = validator.getValue(parameter)

        if (other == null || value === other) {
            return false
        }
    }

    return true
}

export default validate
