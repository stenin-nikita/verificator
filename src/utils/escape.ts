const escape = (str: string): string => {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

export default escape
