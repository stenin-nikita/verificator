import validate from '../../src/rules/date'

const positive = [
    '2000-01-01',
    '01/01/2000',
    new Date(),
    new Date(2014, 6 /* Jul */, 8).toString(),
    new Date(2014, 1 /* Feb */, 11).getTime(),
    0,
    1325376000000
]

const negative = [
    '1325376000',
    new Date(''),
    '',
    'Not a date',
    ['Not', 'a', 'date'],
    null,
    undefined,
    NaN,
    true,
    false,
]

test('date positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('date negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})