const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const acceptable = [true, false, 0, 1, '0', '1']

    return acceptable.includes(value)
}

export default validate