import validate from '../../src/rules/after_or_equal'

const positive = [
    ['2012-01-15', '2012-01-15'],
    ['2012-01-15', '2012-01-14']
]

const negative = [
    ['2012-01-15', '2012-01-16'],
]

test('after_or_equal positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], {})).toBe(true))
})

test('after_or_equal negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], {})).toBe(false))
})