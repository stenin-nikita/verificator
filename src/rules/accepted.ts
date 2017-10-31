import required from './required'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const acceptable = ['yes', 'on', '1', 1, true, 'true']
  
    return required(attribute, value, parameters, validator) && acceptable.includes(value)
}

export default validate