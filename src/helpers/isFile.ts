const isFile = (value: any): boolean => {
    return value instanceof File || value instanceof FileList
}

export default isFile