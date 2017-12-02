import { ALPHA_DASH } from '../constants'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(ALPHA_DASH).some(loc => ALPHA_DASH[loc].test(value))
    }

    return (ALPHA_DASH[locale] || ALPHA_DASH.en).test(value)
}

export default validate
