import Translator from '../src/Translator'

test('set flatten global messages', () => {
    const locale = {
        name: 'test',
        messages: {
            'rule': 'rule message',
            'rule:type': 'rule:type message',
            'foo.rule': 'foo.rule message',
            'foo.rule:type': 'foo.rule:type message',
            'foo.*.bar.rule:type': 'foo.*.bar.rule:type message',
        },
        attributes: {}
    }

    const translator = new Translator(locale)

    expect(translator.getMessage('rule', 'bar', 'value', [], 'string')).toBe('rule message')
    expect(translator.getMessage('rule', 'bar', 'value', [], 'type')).toBe('rule:type message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type message')
    expect(translator.getMessage('rule', 'foo.*.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type message')
    expect(translator.getMessage('rule', 'foo.0.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type message')
    expect(translator.getMessage('another', 'foo', 'value', [], 'type')).toBe('Invalid value for field "foo"')
})

test('set object global messages', () => {
    const locale = {
        name: 'test',
        messages: {
            'rule': 'rule message',
            'foo': {
                'rule': 'foo.rule message',
            },
            'foo.*': {
                'bar': {
                    'rule:type': 'foo.*.bar.rule:type message'
                }
            },
            'bar': {
                '*.foo': {
                    'rule:type': 'bar.*.foo.rule:type message'
                }
            }
        },
        attributes: {}
    }

    const translator = new Translator(locale)

    expect(translator.getMessage('rule', 'bar', 'value', [], 'string')).toBe('rule message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule message')
    expect(translator.getMessage('rule', 'foo.*.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type message')
    expect(translator.getMessage('rule', 'foo.0.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type message')
    expect(translator.getMessage('rule', 'bar.*.foo', 'value', [], 'type')).toBe('bar.*.foo.rule:type message')
    expect(translator.getMessage('rule', 'bar.0.foo', 'value', [], 'type')).toBe('bar.*.foo.rule:type message')
})

test('set flatten custom messages in constructor', () => {
    const locale = {
        name: 'test',
        messages: {
            'rule': 'rule message',
            'rule:type': 'rule:type message',
            'foo.rule': 'foo.rule message',
            'foo.rule:type': 'foo.rule:type message',
            'foo.*.bar.rule:type': 'foo.*.bar.rule:type message',
        },
        attributes: {}
    }

    const translator = new Translator(locale, {
        'rule': 'rule custom message',
        'rule:type': 'rule:type custom message',
        'foo.rule': 'foo.rule custom message',
        'foo.rule:type': 'foo.rule:type custom message',
        'foo.*.bar.rule:type': 'foo.*.bar.rule:type custom message',
    })

    expect(translator.getMessage('rule', 'bar', 'value', [], 'string')).toBe('rule custom message')
    expect(translator.getMessage('rule', 'bar', 'value', [], 'type')).toBe('rule:type custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type custom message')
    expect(translator.getMessage('rule', 'foo.*.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type custom message')
    expect(translator.getMessage('rule', 'foo.0.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type custom message')
    expect(translator.getMessage('rule', 'bar', 'value', [], 'type')).toBe('rule:type custom message')
    expect(translator.getMessage('another', 'foo', 'value', [], 'type')).toBe('Invalid value for field "foo"')
})

test('set object custom messages in constructor', () => {
    const locale = {
        name: 'test',
        messages: {
            'rule': 'rule message',
            'foo': {
                'rule': 'foo.rule message',
            },
            'foo.*': {
                'bar': {
                    'rule:type': 'foo.*.bar.rule:type message'
                }
            },
            'bar': {
                '*.foo': {
                    'rule:type': 'bar.*.foo.rule:type message'
                }
            }
        },
        attributes: {}
    }

    const translator = new Translator(locale, {
        'rule': 'rule custom message',
        'foo': {
            'rule': 'foo.rule custom message',
        },
        'foo.*': {
            'bar': {
                'rule:type': 'foo.*.bar.rule:type custom message'
            }
        },
        'bar': {
            '*.foo': {
                'rule:type': 'bar.*.foo.rule:type custom message'
            }
        }  
    })

    expect(translator.getMessage('rule', 'bar', 'value', [], 'string')).toBe('rule custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule custom message')
    expect(translator.getMessage('rule', 'foo.*.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type custom message')
    expect(translator.getMessage('rule', 'foo.0.bar', 'value', [], 'type')).toBe('foo.*.bar.rule:type custom message')
    expect(translator.getMessage('rule', 'bar.*.foo', 'value', [], 'type')).toBe('bar.*.foo.rule:type custom message')
    expect(translator.getMessage('rule', 'bar.0.foo', 'value', [], 'type')).toBe('bar.*.foo.rule:type custom message')
})

test('set flatten custom messages in method', () => {
    const locale = {
        name: 'test',
        messages: {},
        attributes: {}
    }

    const translator = new Translator(locale, {
        'foo.rule': 'rule custom message',
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('rule custom message')

    translator.setCustomMessages({
        'foo.rule': 'foo.rule custom message',
        'foo.rule:type': 'foo.rule:type custom message',
        'foo.bar.rule_one': 'foo.bar.rule_one',
        'foo.bar.rule_two': 'foo.bar.rule_two',
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type custom message')
    expect(translator.getMessage('rule_one', 'foo.bar', 'value', [], 'string')).toBe('foo.bar.rule_one')
    expect(translator.getMessage('rule_two', 'foo.bar', 'value', [], 'type')).toBe('foo.bar.rule_two')


    translator.addCustomMessages({
        'foo.rule': 'foo.rule new custom message',
        'rule': 'new rule',
        'foo.bar.rule_two': 'foo.bar.rule_two new',
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule new custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type custom message')
    expect(translator.getMessage('rule', 'bar', 'value', [], 'type')).toBe('new rule')
    expect(translator.getMessage('rule_one', 'foo.bar', 'value', [], 'string')).toBe('foo.bar.rule_one')
    expect(translator.getMessage('rule_two', 'foo.bar', 'value', [], 'type')).toBe('foo.bar.rule_two new')
})

test('set object custom messages in method', () => {
    const locale = {
        name: 'test',
        messages: {},
        attributes: {}
    }

    const translator = new Translator(locale, {
        'foo': {
            'rule': 'rule custom message',
        }
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('rule custom message')

    translator.setCustomMessages({
        'foo': {
            'rule': 'foo.rule custom message',
            'rule:type': 'foo.rule:type custom message',
            'bar': {
                'rule_one': 'foo.bar.rule_one',
                'rule_two': 'foo.bar.rule_two',
            },
        }
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type custom message')
    expect(translator.getMessage('rule_one', 'foo.bar', 'value', [], 'string')).toBe('foo.bar.rule_one')
    expect(translator.getMessage('rule_two', 'foo.bar', 'value', [], 'type')).toBe('foo.bar.rule_two')

    translator.addCustomMessages({
        'foo': {
            'rule': 'foo.rule new custom message',
            'bar': {
                'rule_two': 'foo.bar.rule_two new',
            },
        },
        'rule': 'new rule',
    })

    expect(translator.getMessage('rule', 'foo', 'value', [], 'string')).toBe('foo.rule new custom message')
    expect(translator.getMessage('rule', 'foo', 'value', [], 'type')).toBe('foo.rule:type custom message')
    expect(translator.getMessage('rule', 'bar', 'value', [], 'type')).toBe('new rule')
    expect(translator.getMessage('rule_one', 'foo.bar', 'value', [], 'string')).toBe('foo.bar.rule_one')
    expect(translator.getMessage('rule_two', 'foo.bar', 'value', [], 'type')).toBe('foo.bar.rule_two new')
})

test('set global attributes', () => {
    const locale = {
        name: 'test',
        messages: {},
        attributes: {
            'name': 'First Name'
        }
    }

    const translator = new Translator(locale)

    expect(translator.getAttribute('name')).toBe('First Name')
})

test('set custom attributes', () => {
    const locale = {
        name: 'test',
        messages: {},
        attributes: {}
    }

    const translator = new Translator(locale, {}, {
        'name': 'First Name'
    })

    expect(translator.getAttribute('name')).toBe('First Name')

    translator.addCustomAttributes({
        'name': 'Last Name',
        'firstName': 'First Name'
    })

    expect(translator.getAttribute('name')).toBe('Last Name')
    expect(translator.getAttribute('firstName')).toBe('First Name')

    translator.setCustomAttributes({
        'name': 'First Name',
    })

    expect(translator.getAttribute('name')).toBe('First Name')
    expect(translator.getAttribute('firstName')).toBe(null)
})