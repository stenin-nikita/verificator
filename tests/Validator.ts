import Validator from '../src/Validator'

test('test Validator extend', () => {
    Validator.extend('foo', function () {
        return true
    })

    const validator = new Validator({ 'foo': 'bar' }, {
        'foo': 'required|foo',
    })

    expect(validator.hasRule('foo', 'foo')).toBe(true)
    expect(validator.getRule('foo', 'foo')).toEqual({
        name: 'foo',
        parameters: [],
    })

    validator.extend('bar', function () {
        return true
    })
    validator.addRules({
        'foo': 'required|foo|bar'
    })
    expect(validator.hasRule('foo', 'bar')).toBe(true)
    expect(validator.getRule('foo', 'bar')).toEqual({
        name: 'bar',
        parameters: [],
    })

    expect(validator.hasRule('foo', 'baz')).toBe(false)
    expect(validator.getRule('foo', 'baz')).toEqual(null)

    expect(function() {
        Validator.extend('error', null)
    }).toThrow()
})

test('test Validator data', () => {
    const validator = new Validator({}, {
        'foo': 'required',
    })

    expect(validator.getData()).toEqual({})
    expect(validator.getValue('foo')).toBe(undefined)
    validator.setData({ 'foo': 'bar' })
    expect(validator.getData()).toEqual({ 'foo': 'bar' })
    expect(validator.getValue('foo')).toBe('bar')
})

test('test Validator primary attribute', () => {
    const validator = new Validator({
        'foo': [{ 'bar': 'baz' }]
    }, {
        'foo.*.bar': 'required',
    })

    expect(validator.getPrimaryAttribute('foo.0.bar')).toEqual('foo.*.bar')
    expect(validator.getPrimaryAttribute('foo')).toEqual('foo')
    expect(validator.getImplicitAttributes()).toEqual({
        'foo.*.bar': [
            'foo.0.bar'
        ]
    })
})

test('test Validator with custom attributes', () => {
    const validator = new Validator({
        'foo': null,
        'bar': null
    }, {
        'foo': 'required',
        'bar': 'required',
    }, {
        messages: {
            'required': ({ attribute }) => `Required ${attribute}`,
            'bar.required': ({ attribute }) => `Bar required ${attribute}`
        },
        attributes: {
            'foo': 'foo-custom',
            'bar': 'bar-custom'
        }
    })

    return validator.validateAll().then(result => {
        expect(validator.errors.all()).toEqual(['Required foo-custom', 'Bar required bar-custom'])
        expect(validator.errors.first('foo')).toEqual('Required foo-custom')
        expect(validator.errors.first('bar')).toEqual('Bar required bar-custom')
    })
})
