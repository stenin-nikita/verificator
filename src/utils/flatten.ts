import isPlainObject from './isPlainObject'

const flatten = (object: any): any => {
    if (!isPlainObject(object) && !Array.isArray(object)) {
        return object
    }

    let result: any = {}

    for (let key of Object.keys(object)) {
        if (isPlainObject(object[key]) || Array.isArray(object[key])) {
            let keys = Object.keys(object[key])

            if (keys.length) {
                let flatData = flatten(object[key])

                for (let kkey of Object.keys(flatData)) {
                    result[`${key}.${kkey}`] = flatData[kkey]
                }

                continue
            }
        }

        result[key] = object[key]
    }

    return result
}

export default flatten
