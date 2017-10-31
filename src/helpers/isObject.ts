const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object'
}

export default isObject