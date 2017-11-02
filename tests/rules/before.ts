import validate from '../../src/rules/before'

const positive = [
    ['2000-01-01', '2012-01-01'],
    [new Date(2000, 0, 1), '2012-01-01'],
    ['2012-01-01 17:43:59', '2012-01-01 17:44'],
    ['2012-01-01 17:44:01', '2012-01-01 17:44:02'],
]

const negative = [
    [['2000-01-01'], '2012-01-01'],
    [[new Date(2000, 0, 1)], '2012-01-01'],
    ['2012-01-01 17:44', '2012-01-01 17:44:00'],
    ['17:44', '17:44:00'],
]

test('before positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('before negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})