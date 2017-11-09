import { alpha } from '../helpers/alpha'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(alpha).some(loc => alpha[loc].test(value))
    }

    return (alpha[locale] || alpha.en).test(value)
}

export default validate
