import escapeString from './escapeString'

const is = (patterns: string|string[], value: string): boolean => {
    patterns = Array.isArray(patterns) ? patterns : [patterns]
    patterns = patterns.filter(Boolean)

    if (patterns.length === 0) {
        return false
    }

    for (let pattern of patterns) {
        if (pattern === value) {
            return true
        }

        const regex = new RegExp(`^${escapeString(pattern).replace(/\\\*/g, '.*')}$`, 'u')

        if (regex.test(value)) {
            return true
        }
    }

    return false
}

export default is
