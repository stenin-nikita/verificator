import validate from '../../src/rules/numeric'

const positive = [
    '1234567890',
    123
]

const negative = [
    'a',
    '1234567a89',
    null,
    undefined,
    true,
    false,
    {},
    '+123',
    '-123'
]

test('numeric positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('numeric negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})