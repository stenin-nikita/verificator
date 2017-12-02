const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const val = validator.getValue(attribute, '__MISSING__')

    return val !== '__MISSING__'
}

export default validate
