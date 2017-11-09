import { alphaDash } from '../helpers/alpha'

const validate = (attribute: string, value: any, [ locale ]: any[], validator: any): boolean => {
    // Match at least one locale.
    if (! locale) {
        return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value))
    }

    return (alphaDash[locale] || alphaDash.en).test(value)
}

export default validate
