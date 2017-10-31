import validate from '../../src/rules/alpha_dash'

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
    '123-abc',
    '123_abc',
    true,
    false
]

const negative = [
    'this is sparta',
    {},
    ' ',
    ['a', 'b', 'cdef-_'],
    [' ', 'ada as']
]

test('alpha_dash positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('alpha_dash negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})

test('alpha_dash other locales', () => {
    // any locale.
    expect(validate('any', 'سلا-م_', [], {})).toBe(true)
    expect(validate('any', 'Привет_-', [], {})).toBe(true)
  
    // specfic locale
    expect(validate('specfic', 'peace', ['ar'], {})).toBe(false)
    expect(validate('specfic', 'peace', ['ru'], {})).toBe(false)

    // non-existant locale defaults to english validation.
    expect(validate('non-existant', 'peace', ['blah'], {})).toBe(true)
    // non english characters.
    expect(validate('non-existant', 'اين اشيائي', ['blah'], {})).toBe(false)
})