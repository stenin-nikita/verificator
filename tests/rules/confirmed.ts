import validate from '../../src/rules/confirmed'

const data = {
    one_confirmation: 'value',
    two_confirmation: 0,
    three_confirmation: null,
    four_confirmation: undefined,
    five_confirmation: {},
}

const validator = {
    getValue(attribute) {
        return data[attribute]
    }
}

const positive = [
    ['one', 'value'],
    ['two', 0],
    ['three', null],
    ['four', undefined],
    ['over', undefined],
]

const negative = [
    ['one', ''],
    ['two', 1],
    ['three', undefined],
    ['four', null],
    ['five', {}],
    ['over', null],
]

test('same positive', () => {
    positive.forEach(value => expect(validate(String(value[0]), value[1], [], validator)).toBe(true))
})

test('same negative', () => {
    negative.forEach(value => expect(validate(String(value[0]), value[1], [], validator)).toBe(false))
})