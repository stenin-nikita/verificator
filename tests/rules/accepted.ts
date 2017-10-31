import validate from '../../src/rules/accepted'

const positive = ['yes', 'on', '1', 1, true, 'true']
const negative = ['no', 'off', '0', 0, false, 'false', null]

test('accepted positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('accepted negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})