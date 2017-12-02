import isURL from 'validator/lib/isURL'
import { URL_PROTOCOLS } from '../constants'

const validate = (attribute: string, value: any, [requireProtocol = true]: any[], validator: any): boolean => {
    if (typeof value !== 'string') {
        return false
    }

    const options: any = {
        protocols: URL_PROTOCOLS,
        require_host: true,
        require_protocol: [true, 1, '1'].indexOf(requireProtocol) > -1,
    }

    return isURL(value, options)
}

export default validate
