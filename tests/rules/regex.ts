import validate from '../../src/rules/regex'

const positive = [
    ['1234567890', /^[0-9]+$/],
    ['1234567890', '^[0-9]+$']
]

const negative = [
    ['abc', /^[0-9]+$/],
    ['abc-123', /^[0-9]+$/],
    ['1234abc5', /^[0-9]+$/],
    ['', '^[0-9]+$'],
    ['abc', '^[0-9]+$'],
    ['abc-123', '^[0-9]+$'],
    ['1234abc5', '^[0-9]+$'],
    ['', '^[0-9]+$']
]

test('regex positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('regex negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})