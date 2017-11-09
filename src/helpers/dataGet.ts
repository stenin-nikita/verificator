import isObject from './isObject'

const dataGet = (obj: any, key: string, defaultValue?: any): any => {
    if (! isObject(obj)) {
        return defaultValue
    }

    if (key == null) {
        return obj
    }

    if (key in obj) {
        return obj[key]
    }

    if (key.indexOf('.') === -1) {
        return obj[key] || defaultValue
    }

    for (let segment of key.split('.')) {
        if (isObject(obj) && segment in obj) {
            obj = obj[segment]
        } else {
            return defaultValue
        }
    }

    return obj
}

export default dataGet
