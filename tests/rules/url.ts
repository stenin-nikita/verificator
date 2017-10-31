import validate from '../../src/rules/url'

const positive = [
    'https://foo.com/blah_blah',
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://j.mp',
    'http://foo.bar/%20URL-encoded%20stuff',
    'http://1337.net',
    'http://a.b-c.de'
]

const negative = [
    'http://',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    'http://foo.bar?q=Spaces should be encoded',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'rdar://1234',
    'h://test',
    'http:// shouldfail.com',
    ':// should fail',
    'http://foo.bar/foo(bar)baz quux',
    'ftps://foo.bar/',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
    undefined,
    null,
    false,
    true,
    '',
    [],
    {},
]

test('url positive', () => {
    positive.forEach(value => expect(validate('positive', value, [], {})).toBe(true))
})

test('url negative', () => {
    negative.forEach(value => expect(validate('negative', value, [], {})).toBe(false))
})

test('url test require protocol', () => {
    expect(validate('require_protocol', 'google.com', [true], {})).toBe(false)
    expect(validate('require_protocol', 'https://google.com', [true], {})).toBe(true)
    expect(validate('require_protocol', 'google.com', [false], {})).toBe(true)
    expect(validate('require_protocol', 'https://google.com', [false], {})).toBe(true)
})
