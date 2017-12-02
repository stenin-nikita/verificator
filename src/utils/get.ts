const get = (object: any, key: string, defaultValue?: any): any => {
    if (object == null) {
        return defaultValue
    }

    let path = key.split('.')

    let index = 0
    const length = path.length

    while (object != null && index < length) {
        object = object[path[index++]]
    }

    const result = (index && index === length) ? object : undefined

    return result === undefined ? defaultValue : result
}

export default get
