import validate from './../../src/rules/alpha_num';

const positive = [
    'a',
    'abcdefgHijklMnOpqRsTUVwxYZ',
    '1234567890',
    'abc123',
    123,
    '',
    null,
    undefined,
    'null',
    'undefined',
    true,
    false
]

const negative = [
    'this is sparta',
    '123-abc',
    {},
    ' ',
    ['asdasda  ', '123 ad'],
    ['asdad', 123, 'asd2123']
]

test('alpha_num positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('alpha_num negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})

test('alpha_num other locales', () => {
    // any locale.
    expect(validate('any', 'سلام12', [], {})).toBe(true)
    expect(validate('any', 'Привет12', [], {})).toBe(true)
  
    // specfic locale
    expect(validate('specfic', 'peace', ['ar'], {})).toBe(false)
    expect(validate('specfic', 'peace', ['ru'], {})).toBe(false)

    // non-existant locale defaults to english validation.
    expect(validate('non-existant', 'peace', ['blah'], {})).toBe(true)
    // non english characters.
    expect(validate('non-existant', 'اين اشيائي', ['blah'], {})).toBe(false)
})