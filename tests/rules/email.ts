import validate from '../../src/rules/email'

const positive = [
    'someone@example.com',
    'someone@example.co',
    'someone123@example.co.uk',
    'Pelé@example.com',
    'very.common@example.com',
    'other.email-with-dash@example.com',
    'disposable.style.email.with+symbol@example.com'
]

const negative = [
    '@example.com',
    '@example',
    undefined,
    null,
    'undefined',
    'null',
    'someone@example.c',
    true,
    false
]

test('email positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('email negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})