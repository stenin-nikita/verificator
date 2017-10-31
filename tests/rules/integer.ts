import validate from '../../src/rules/integer'

const positive = [
    '1234567890',
    123,
    -123,
    '-1234'
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
    12.2,
    '13.3'
]

test('integer positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('integer negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})