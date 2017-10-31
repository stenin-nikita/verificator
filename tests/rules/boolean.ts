import validate from '../../src/rules/boolean'

const positive = [
    true,
    false,
    0,
    1,
    '0',
    '1'
]

const negative = [
    '10',
    'test',
    'on',
    'off',
    'true',
    'false',
    undefined,
    null,
    [],
    {}
]

test('boolean positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('boolean negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})