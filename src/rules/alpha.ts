import { ALPHA } from '../constants'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(ALPHA).some(loc => ALPHA[loc].test(value))
    }

    return (ALPHA[locale] || ALPHA.en).test(value)
}

export default validate
