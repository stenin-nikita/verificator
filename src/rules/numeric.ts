const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    return /^[0-9]+$/.test(String(value))
}

export default validate