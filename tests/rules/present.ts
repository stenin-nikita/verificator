import validate from '../../src/rules/present'

const positive = [
    null,
    false,
    '',
    0,
    '0',
    'undefined',
    'null',
    's ',
    ' ',
]

const negative = [
    undefined
]

test('present positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('present negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})