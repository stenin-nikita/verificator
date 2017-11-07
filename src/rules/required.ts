const validate = (attribute: string, value: any, parameters: any[], validator: any) => {
    if (value == null) {
        return false
    } else if (typeof value === 'string' && value.trim() === '') {
        return false
    } else if (Array.isArray(value) && value.length < 1) {
        return false
    }

    return true
}

export default validate