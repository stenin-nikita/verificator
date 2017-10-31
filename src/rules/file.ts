import isFile from '../helpers/isFile'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return isFile(value)
}

export default validate