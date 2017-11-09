const escapeString = (str: string): string => {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

export default escapeString
