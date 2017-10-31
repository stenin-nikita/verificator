import validate from './../../src/rules/alpha';

const positive = [
    'abcdefgHijklMnOpqRsTUVwxYZ',
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
    '1234567a89',
    {},
    ' ',
    ['abcdefg', 'hijk', 'lmnopq'],
    ['abcdefg', 'hijk', 'lmnopq123']
]

test('alpha positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('alpha negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})

test('alpha other locales', () => {
    // any locale.
    expect(validate('any', 'سلام', [], {})).toBe(true)
    expect(validate('any', 'Привет', [], {})).toBe(true)
  
    // specfic locale
    expect(validate('specfic', 'peace', ['ar'], {})).toBe(false)
    expect(validate('specfic', 'peace', ['ru'], {})).toBe(false)

    // non-existant locale defaults to english validation.
    expect(validate('non-existant', 'peace', ['blah'], {})).toBe(true)
    // non english characters.
    expect(validate('non-existant', 'اين اشيائي', ['blah'], {})).toBe(false)
})