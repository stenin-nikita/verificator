import { ALPHA_NUMERIC } from '../constants'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(ALPHA_NUMERIC).some(loc => ALPHA_NUMERIC[loc].test(value))
    }

    return (ALPHA_NUMERIC[locale] || ALPHA_NUMERIC.en).test(value)
}

export default validate
