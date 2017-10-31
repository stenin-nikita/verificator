import isURL from 'validator/lib/isURL'

const validate = (attribute: string, value: any, [ requireProtocol = true ]: any[], validator: any): boolean => {
    const options: ValidatorJS.IsURLOptions = {
        require_host: true,
        require_protocol: [true, 1, '1'].indexOf(requireProtocol) > -1,
        allow_underscores: true
    }

    return isURL(String(value), options)
}

export default validate