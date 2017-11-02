import validate from '../../src/rules/after'

const positive = [
    ['2012-01-01', '2000-01-01'],
    [new Date(2012, 0, 1), '2000-01-01'],
    ['2012-01-01 17:43:59', '2012-01-01 17:43:58'],
]

const negative = [
    ['2012-01-15', '2012-01-16'],
    ['17:44', '17:44:00'],
    [['2012-01-01'], '2000-01-01'],
    [[new Date(2012, 0, 1)], '2000-01-01'],
]

test('after positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('after negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})