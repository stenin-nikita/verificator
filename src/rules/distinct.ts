import * as utils from '../utils'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const data: any[] = []

    const attributeName = validator.getPrimaryAttribute(attribute)
    const path = attributeName.split('*')[0].replace(/^\.|\.$/g, '') || null
    const attributeData: any = utils.flatten(validator.getValue(path))
    const attributeNameRegex = new RegExp(`^${utils.escape(attributeName).replace(/\\\*/g, '([^\.]+)')}`, 'u')

    Object.keys(attributeData).forEach(k => {
        const key = `${path}.${k}`

        if (key !== attribute && attributeNameRegex.test(key)) {
            data.push(attributeData[k])
        }
    })

    if (parameters.indexOf('ignore_case') > -1) {
        const regex = new RegExp(`${utils.escape(value)}`, 'iu')

        return data.filter(val => {
            return regex.test(val)
        }).length === 0
    }

    return data.indexOf(value) === -1
}

export default validate
