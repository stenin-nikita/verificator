import validate from '../../src/rules/required'

const positive = [
    'asjdj',
    0,
    'undefined',
    'null',
    's ',
    true,
    false
]

const negative = [
    '',
    ' ',
    [],
    undefined,
    null
]

test('required positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('required negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})