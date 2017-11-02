import validate from '../../src/rules/size'

const validator = {
    hasRule(attribute) {
        return attribute === 'numeric'
    },
}

test('size numeric positive', () => {
    const positive = [
        [10, 10],
        [0, '0'],
        [2.25, 2.25],
    ]

    positive.forEach(value => expect(validate('numeric', value[0], [value[1]], validator)).toBe(true))
})

test('size numeric negative', () => {
    const negative = [
        [0, 1],
        [1.2, 1.3],
    ]

    negative.forEach(value => expect(validate('numeric', value[0], [value[1]], validator)).toBe(false))
})

test('size string positive', () => {
    const positive = [
        ['foo', '3'],
        ['', '0'],
        [' ', '1'],
        ['привет', '6']
    ]

    positive.forEach(value => expect(validate('string', value[0], [value[1]], validator)).toBe(true))
})

test('size string negative', () => {
    const negative = [
        ['foo', 4],
        ['test', 3],
        ['a b', 2],
    ]

    negative.forEach(value => expect(validate('string', value[0], [value[1]], validator)).toBe(false))
})

test('size array positive', () => {
    const positive = [
        [[], 0],
        [[1], 1],
        [[1, null, undefined], 3],
    ]

    positive.forEach(value => expect(validate('array', value[0], [value[1]], validator)).toBe(true))
})

test('size array negative', () => {
    const negative = [
        [[], 1],
        [[1], 0],
        [[1, null, undefined], 1],
    ]

    negative.forEach(value => expect(validate('array', value[0], [value[1]], validator)).toBe(false))
})

test('size failed types', () => {
    const negative = [
        [null, 0],
        [undefined, 0],
        [{}, 0],
    ]

    negative.forEach(value => expect(validate('failed', value[0], [value[1]], validator)).toBe(false))
})