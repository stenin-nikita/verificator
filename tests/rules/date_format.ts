import validate from '../../src/rules/date_format'

const positive = [
    ['2000-01-01', 'YYYY-MM-DD'],
    ['2013-02', 'YYYY-MM'],
    ['2000-01-01T00:00:00+00:00', 'YYYY-MM-DD[T]HH:mm:ssZ'],
    ['2000-01-01T00:00:00+0000', 'YYYY-MM-DD[T]HH:mm:ssZZ'],
    ['2000-01-01T00:00:00Z', 'YYYY-MM-DD[T]HH:mm:ss[Z]'],
    ['2000-01-01 17:43:59', 'YYYY-MM-DD HH:mm:ss'],
    ['17:43:59', 'HH:mm:ss'],
    ['17:43', 'HH:mm']
]

const negative = [
    ['01/01/2001', 'YYYY-MM-DD'],
    ['22000-01-01', 'YYYY-MM-DD'],
    ['00-01-01', 'YYYY-MM-DD'],
    [['Not', 'a', 'date'], 'YYYY-MM-DD'],
    ['2000-01-01 17:43:59', 'HH:mm:ss'],
    ['17:43:59', 'HH:mm']
]

test('date_format positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('date_format negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})