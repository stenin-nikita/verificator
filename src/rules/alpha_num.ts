import { alphanumeric } from '../helpers/alpha'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value))
    }

    return (alphanumeric[locale] || alphanumeric.en).test(value)
}

export default validate
