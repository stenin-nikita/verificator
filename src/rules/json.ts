const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    if (!(/boolean|number|string/).test(typeof value)) {
        return false
    }

    try {
        const json = JSON.parse(value)

        return (/boolean|number|object/).test(typeof json)
    } catch (e) {
        return false
    }
}

export default validate
