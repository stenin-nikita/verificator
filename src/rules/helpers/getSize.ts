import isNumeric from './isNumeric'

const getSize = (attribute: string, value: any, validator: any): number => {
    const hasNumeric = validator.hasRule(attribute, ['numeric', 'integer'])

    if (isNumeric(value) && hasNumeric) {
        return Number(value)
    } else if (Array.isArray(value)) {
        return value.length
    }

    return String(value).length
}

export default getSize
