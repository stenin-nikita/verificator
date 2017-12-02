import { REGEXP_IS_UINT } from '../constants'
import isObject from './isObject'

const set = (object: any, keyPath: string, value: any): any => {
    const path = keyPath.split('.')
    const length = path.length
    const lastIndex = length - 1

    let index = -1
    let nested = object

    while (nested != null && ++index < length) {
        const key = path[index]
        let newValue = value

        if (index !== lastIndex) {
            const objValue = nested[key]

            newValue = isObject(objValue) ? objValue : (REGEXP_IS_UINT.test(path[index + 1]) ? [] : {})
        }

        nested[key] = newValue
        nested = nested[key]
    }

    return object
}

export default set
