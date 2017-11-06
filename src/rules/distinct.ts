import escapeString from '../helpers/escapeString'
import flattenData from '../helpers/flattenData'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    const data: any[] = []

    const attributeName = validator.getPrimaryAttribute(attribute)
    const path = attributeName.split('*')[0].replace(/^\.|\.$/g, '') || null
    const attributeData: any = flattenData(validator.getValue(path))
    const regex = new RegExp(`^${escapeString(attributeName).replace(/\\\*/g, '([^\.]+)')}`, 'u')

    Object.keys(attributeData).forEach(k => {
        const key = `${path}.${k}`

        if (key != attribute && regex.test(key)) {
            data.push(attributeData[k])
        }
    })

    if (parameters.indexOf('ignore_case') > -1) {
        const regex = new RegExp(`${escapeString(value)}`, 'iu')

        return data.filter(val => {
            return regex.test(val)
        }).length == 0
    }

    return data.indexOf(value) == -1
}

export default validate