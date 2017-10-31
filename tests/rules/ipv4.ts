import validate from '../../src/rules/ipv4'

const positive = [
    '192.168.1.1',
    '255.255.255.255',
    '127.0.0.1',
    '0.0.0.0',
]

const negative = [
    '::1',
    '2001:db8:0000:1:1:1:1:1',
    '::ffff:127.0.0.1',
    '192.168.a.1',
    '255.255.255.256',
    '23.a.f.234',
    '::ffff:287.0.0.1',
]

test('ipv4 positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('ipv4 negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})