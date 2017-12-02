const compare = (first: number, second: number, operator: string) => {
    switch (operator) {
        case '<':
            return first < second
        case '>':
            return first > second
        case '<=':
            return first <= second
        case '>=':
            return first >= second
        case '=':
            return first === second
        default:
            throw new TypeError()
    }
}

export default compare