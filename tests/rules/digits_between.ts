import validate from '../../src/rules/digits_between'

const positive = [
    '123',
    '456',
    '789',
    '012',
    '1234',
    '02'
]

const negative = [
    '',
    undefined,
    null,
    {},
    '1',
    'abc',
    '12a',
    '123456',
    []
]

test('digits_between positive', () => {
    positive.forEach(value => expect(validate('positive', value, [2,4], {})).toBe(true))
})

test('digits_between negative', () => {
    negative.forEach(value => expect(validate('negative', value, [2,4], {})).toBe(false))
})