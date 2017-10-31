import validate from '../../src/rules/json'

const positive = [
    true,
    false,
    0,
    1,
    '{}',
    '{"test": "test"}'
]

const negative = [
    null,
    undefined,
    [],
    {},
    ''
]

test('json positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('json negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})