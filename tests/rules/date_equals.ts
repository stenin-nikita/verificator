import validate from '../../src/rules/date_equals'

const positive = [
    ['2000-01-01', '2000-01-01'],
    [new Date(2000, 0, 1), '2000-01-01'],
    [new Date(1970, 0, 1), 0],
    [new Date(2000, 0, 1), '0'],
    ['0', '0'],
    [1, 1],
    ['1970-01-01 00:00:00', 0],
]

const negative = [
    ['01/01/2001', '02/01/2001'],
    [new Date(2000, 0, 1), '2001-01-01'],
    [new Date(1970, 0, 1), '0'],
    [new Date(2000, 0, 1), 0],
    [null, null],
    [undefined, undefined],
]

test('date_equals positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('date_equals negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})