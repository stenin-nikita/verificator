import validate from '../../src/rules/array'

const positive = [
    ['test'],
    []
]

const negative = [
    undefined,
    null,
    true,
    false,
    1,
    0,
    '',
    'test',
    {}
]

test('array positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})


test('array negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})