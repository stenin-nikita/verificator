import isFile from './isFile'
import isNumeric from '../helpers/isNumeric'

const getSize = (attribute: string, value: any, validator: any): number => {
    const hasNumeric = validator.hasRule(attribute, ['numeric', 'integer'])

    if (isNumeric(value) && hasNumeric) {
        return Number(value)
    } else if (Array.isArray(value)) {
        return value.length
    } else if (isFile(value)) {
        const file = value instanceof FileList ? value[0] : value

        return file.size / 1024
    }

    return String(value).length
}

export default getSize