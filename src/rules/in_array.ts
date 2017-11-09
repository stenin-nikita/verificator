import requireParameterCount from '../helpers/requireParameterCount'
import escapeString from '../helpers/escapeString'
import flattenData from '../helpers/flattenData'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'in_array')

    const [ path ] = parameters
    const otherValues: any[] = []
    const explicitPath = path.split('*')[0].replace(/^\.|\.$/g, '') || null
    const attributeData: any = flattenData(validator.getValue(explicitPath))
    const regex = new RegExp(`^${escapeString(path).replace(/\\\*/g, '([^\.]+)')}`)

    Object.keys(attributeData).forEach(key => {
        if (regex.exec(`${explicitPath}.${key}`)) {
            otherValues.push(attributeData[key])
        }
    })

    return otherValues.indexOf(value) > -1
}

export default validate
