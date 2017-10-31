import validate from '../../src/rules/nullable'

const positive = [
    undefined,
    null,
    true,
    false,
    0,
    1,
    '0',
    '1',
    'test',
    [],
    {}
]

test('nullable positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})