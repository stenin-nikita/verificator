import validate from '../../src/rules/date_equals'

const positive = [
    ['2000-01-01', '2000-01-01'],
    [new Date(2000, 0, 0), '2000-01-01'],
    //[new Date(), 'today']
]

const negative = [
    ['01/01/2001', '02/01/2001'],
    [new Date(2000, 0, 1), '2001-01-01'],
]

test('date_equals positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('date_equals negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})