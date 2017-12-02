import isObjectLike from './isObjectLike'

const toString = (value: any): string => Object.prototype.toString.call(value)

const isPlainObject = (value: any): boolean => {
    if (!isObjectLike(value) || toString(value) !== '[object Object]') {
        return false
    }

    if (Object.getPrototypeOf(value) === null) {
        return true
    }

    let proto = value

    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(value) === proto
}

export default isPlainObject
