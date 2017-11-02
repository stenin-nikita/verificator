import validate from '../../src/rules/same'

const validator = {
    getValue: jest.fn()
        .mockReturnValueOnce('value')
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce('value')
        .mockReturnValue('undefined')
}

const positive = [
    ['value', 'some_field'],
    [null, 'other_field'],
    [1, 'more_field'],
]

const negative = [
    ['value', 'other_field'],
    [null, 'some_field'],
    [null, null],
    [undefined, null],
    [null, undefined],
    [0, 0],
]

test('same positive', () => {
    positive.forEach(value => expect(validate('positive', value[0], [value[1]], validator)).toBe(true))
})

test('same negative', () => {
    negative.forEach(value => expect(validate('negative', value[0], [value[1]], validator)).toBe(false))
})