import validate from '../../src/rules/digits'

const positive = [
    '123',
    '456',
    '789',
    '012'
]

const negative = [
    '',
    undefined,
    null,
    {},
    '1234',
    '12',
    'abc',
    '12a',
    []
]

test('digits positive', () => {
    positive.forEach(value => expect(validate('positive', value, [3], {})).toBe(true))
})

test('digits negative', () => {
    negative.forEach(value => expect(validate('negative', value, [3], {})).toBe(false))
})