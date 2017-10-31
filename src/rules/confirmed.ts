import same from './same'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return same(attribute, value, [`${attribute}_confirmation`], validator)
}

export default validate