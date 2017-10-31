import mimes from './mimes'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return mimes(attribute, value, ['jpeg', 'png', 'gif', 'bmp', 'svg'], validator)
}

export default validate