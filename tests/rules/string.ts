import validate from '../../src/rules/string'

const positive = [
    'test',
    '',
]

const negative = [
    undefined,
    null,
    true,
    false,
    0,
    1,
    [],
    {}
]

test('string positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('string negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})