import isObject from './isObject'

const dataSet = (obj: any, key: string, value: any) => {
    if (key == null) {
        return obj = value
    }

    const keys = key.split('.')

    while (keys.length > 1) {
        key = String(keys.shift())

        if (!(key in obj) || !isObject(obj[key])) {
            obj[key] = {}
        }

        obj = obj[key]
    }

    obj[String(keys.shift())] = value
}

export default dataSet
