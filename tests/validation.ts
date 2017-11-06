import Validator from '../src/Validator'
import locale from '../locale/ru'

const validator = (data: any, rules: any): Promise<boolean> => {
    return new Validator(data, rules, locale).passes()
}

test('validate present', () => {
    const promises = [
        validator({}, { name: 'present' }),
        validator({}, { name: 'present|nullable' }),
        validator({ name: null }, { name: 'present|nullable' }),
        validator({ name: '' }, { name: 'present' }),
        validator({ foo: [ { id: 1 }, {} ] }, { name: 'present' }),
        validator({ foo: [ { id: 1 }, { name: 'a' } ] }, { 'foo.*.id': 'present' }),
        validator({ foo: [ { id: 1 }, {} ] }, { 'foo.*.id': 'present' }),
        validator({ foo: [ { id: 1 }, { id: '' } ] }, { 'foo.*.id': 'present' }),
        validator({ foo: [ { id: 1 }, { id: null } ] }, { 'foo.*.id': 'present' })
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
    })
})

test('validate required', () => {
    const promises = [
        validator({}, { name: 'required' }),
        validator({ name: '' }, { name: 'required' }),
        validator({ name: 'foo' }, { name: 'required' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
    })
})

test('validate required_with', () => {
    const promises = [
        validator({ 'first': 'Nikita' }, { 'last': 'required_with:first' }),
        validator({ 'first': 'Nikita', 'last': '' }, { 'last': 'required_with:first' }),
        validator({ 'first': '' }, { 'last': 'required_with:first' }),
        validator({}, { 'last': 'required_with:first' }),
        validator({ 'first': 'Nikita', 'last': 'Stenin' }, { 'last': 'required_with:first' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
    })
})

test('validate required_with_all', () => {
    const promises = [
        validator({ 'first': 'foo' }, { 'last': 'required_with_all:first,foo' }),
        validator({ 'first': 'foo' }, { 'last': 'required_with_all:first' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
    })
})

test('validate required_without', () => {
    const promises = [
        validator({ 'first': 'Nikita' }, { 'last': 'required_without:first' }),
        validator({ 'first': 'Nikita', 'last': '' }, { 'last': 'required_without:first' }),
        validator({ 'first': '' }, { 'last': 'required_without:first' }),
        validator({}, { 'last': 'required_without:first' }),
        validator({ 'first': 'Nikita', 'last': 'Stenin' }, { 'last': 'required_without:first' }),
        validator({ 'last': 'Stenin' }, { 'last': 'required_without:first' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(true)
    })
})

test('validate required_without_multiple', () => {
    const rules = {
        'f1': 'required_without:f2,f3',
        'f2': 'required_without:f1,f3',
        'f3': 'required_without:f1,f2',
    }

    const promises = [
        validator({}, rules),
        validator({ 'f1': 'foo' }, rules),
        validator({ 'f2': 'foo' }, rules),
        validator({ 'f1': 'foo', 'f2': 'bar' }, rules),
        validator({ 'f2': 'foo', 'f3': 'bar' }, rules),
        validator({ 'f1': 'foo', 'f2': 'bar', 'f3': 'baz' }, rules)
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(true)
    })
})

test('validate required_without_all', () => {
    const rules = {
        'f1': 'required_without_all:f2,f3',
        'f2': 'required_without_all:f1,f3',
        'f3': 'required_without_all:f1,f2',
    }

    const promises = [
        validator({}, rules),
        validator({ 'f1': 'foo' }, rules),
        validator({ 'f2': 'foo' }, rules),
        validator({ 'f3': 'foo' }, rules),
        validator({ 'f1': 'foo', 'f2': 'bar' }, rules),
        validator({ 'f1': 'foo', 'f3': 'bar' }, rules),
        validator({ 'f2': 'foo', 'f3': 'bar' }, rules),
        validator({ 'f1': 'foo', 'f2': 'bar', 'f3': 'baz' }, rules),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
    })
})

test('validate required_if', () => {
    const promises = [
        validator({ 'first': 'nikita' }, { 'last': 'required_if:first,nikita' }),
        validator({ 'first': 'nikita', 'last': 'stenin' }, { 'last': 'required_if:first,nikita' }),
        validator({ 'first': 'nikita', 'last': 'stenin' }, { 'last': 'required_if:first,nikita,ivan' }),
        validator({ 'first': 'ivan', 'last': 'ivanov' }, { 'last': 'required_if:first,nikita,ivan' }),
        validator({ 'foo': true }, { 'bar': 'required_if:foo,false' }),
        validator({ 'foo': true }, { 'bar': 'required_if:foo,true' }),
        validator({ 'first': 'ivan', 'last': '' }, { 'last': 'required_if:first,nikita,ivan' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
    })
})

test('validate required_unless', () => {
    const promises = [
        validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,ivan' }),
        validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,nikita' }),
        validator({ 'first': 'ivan', 'last': 'ivanov' }, { 'last': 'required_unless:first,nikita' }),
        validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,nikita,ivan' }),
        validator({ 'first': 'ivan' }, { 'last': 'required_unless:first,nikita,ivan' }),
        validator({ 'first': 'pavel', 'last': '' }, { 'last': 'required_unless:first,nikita,ivan' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
    })
})

test('validate in_array', () => {
    const promises = [
        validator({ 'foo': [1, 2, 3], 'bar': [1, 2] }, { 'foo.*': 'in_array:bar.*' }),
        validator({ 'foo': [1, 2], 'bar': [1, 2, 3] }, { 'foo.*': 'in_array:bar.*' }),
        validator({ 'foo': [{ 'bar_id': 5 }, { 'bar_id': 2 }], 'bar': [{'id': 1}, {'id': 2}] }, { 'foo.*.bar_id': 'in_array:bar.*.id' }),
        validator({ 'foo': [{ 'bar_id': 1 }, { 'bar_id': 2 }], 'bar': [{'id': 1}, {'id': 2}] }, { 'foo.*.bar_id': 'in_array:bar.*.id' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
    })
})

test('validate confirmed', () => {
    const promises = [
        validator({ 'password': 'foo' }, {'password': 'confirmed'}),
        validator({ 'password': 'foo', 'password_confirmation': 'bar' }, { 'password': 'confirmed'}),
        validator({ 'password': 'foo', 'password_confirmation': 'foo' }, { 'password': 'confirmed'}),
        validator({ 'password': '1e2', 'password_confirmation': '100' }, { 'password': 'confirmed'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
    })
})

test('validate same', () => {
    const promises = [
        validator({ 'foo': 'bar', 'baz': 'boom' }, { 'foo': 'same:baz' }),
        validator({ 'foo': 'bar' }, { 'foo': 'same:baz' }),
        validator({ 'foo': 'bar', 'baz': 'bar' }, { 'foo': 'same:baz'}),
        validator({ 'foo': '1e2', 'baz': '100' }, { 'foo': 'same:baz'}),
        validator({ 'foo': null, 'baz': null }, { 'foo': 'same:baz' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(true)
    })
})

test('validate different', () => {
    const promises = [
        validator({ 'foo': 'bar', 'baz': 'boom'}, {'foo': 'different:baz'}),
        validator({ 'foo': 'bar'}, {'foo': 'different:baz'}),
        validator({ 'foo': 'bar', 'baz': 'bar'}, {'foo': 'different:baz'}),
        validator({ 'foo': '1e2', 'baz': '100'}, {'foo': 'different:baz'}),
        validator({ 'foo': 'bar', 'fuu': 'baa', 'baz': 'boom'}, {'foo': 'different:fuu,baz'}),
        validator({ 'foo': 'bar', 'baz': 'boom'}, {'foo': 'different:fuu,baz'}),
        validator({ 'foo': 'bar', 'fuu': 'bar', 'baz': 'boom'}, {'foo': 'different:fuu,baz'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
    })
})

test('validate accepted', () => {
    const promises = [
        validator({'foo': 'no'}, {'foo': 'accepted'}),
        validator({'foo': null}, {'foo': 'accepted'}),
        validator({}, {'foo': 'accepted'}),
        validator({'foo': 0}, {'foo': 'accepted'}),
        validator({'foo': false}, {'foo': 'accepted'}),
        validator({'foo': 'false'}, {'foo': 'accepted'}),
        validator({'foo': 'yes'}, {'foo': 'accepted'}),
        validator({'foo': 'on'}, {'foo': 'accepted'}),
        validator({'foo': '1'}, {'foo': 'accepted'}),
        validator({'foo': 1}, {'foo': 'accepted'}),
        validator({'foo': true}, {'foo': 'accepted'}),
        validator({'foo': 'true'}, {'foo': 'accepted'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(true)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(true)
    })
})

test('validate string', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': 'string'}),
        validator({'x': {'blah': 'test'}}, {'x': 'string'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
    })
})

test('validate json', () => {
    const promises = [
        validator({'foo': 'aslksd'}, {'foo': 'json'}),
        validator({'foo': '{}'}, {'foo': 'json'}),
        validator({'foo': '{"name":"John","age":"34"}'}, {'foo': 'json'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
    })
})

test('validate boolean', () => {
    const promises = [
        validator({'foo': 'no'}, {'foo': 'boolean'}),
        validator({'foo': 'yes'}, {'foo': 'boolean'}),
        validator({'foo': 'false'}, {'foo': 'boolean'}),
        validator({'foo': 'true'}, {'foo': 'boolean'}),
        validator({}, {'foo': 'boolean'}),
        validator({'foo': false}, {'foo': 'boolean'}),
        validator({'foo': true}, {'foo': 'boolean'}),
        validator({'foo': '1'}, {'foo': 'boolean'}),
        validator({'foo': 1}, {'foo': 'boolean'}),
        validator({'foo': '0'}, {'foo': 'boolean'}),
        validator({'foo': 0}, {'foo': 'boolean'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(true)
        expect(result[10]).toBe(true)
    })
})

test('validate numeric', () => {
    const promises = [
        validator({'foo': 'asdad'}, {'foo': 'numeric'}),
        validator({'foo': '1.23'}, {'foo': 'numeric'}),
        validator({'foo': '-1'}, {'foo': 'numeric'}),
        validator({'foo': '1'}, {'foo': 'numeric'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
    })
})

test('validate integer', () => {
    const promises = [
        validator({'foo': 'asdad'}, {'foo': 'integer'}),
        validator({'foo': '1.23'}, {'foo': 'integer'}),
        validator({'foo': '-1'}, {'foo': 'integer'}),
        validator({'foo': '1'}, {'foo': 'integer'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
    })
})

test('validate digits', () => {
    const promises = [
        validator({'foo': '12345'}, {'foo': 'digits:5'}),
        validator({'foo': '123'}, {'foo': 'digits:200'}),
        validator({'foo': '+2.37'}, {'foo': 'digits:5'}),
        validator({'foo': '2e7'}, {'foo': 'digits:3'}),
        validator({'foo': '12345'}, {'foo': 'digits_between:1,6'}),
        validator({'foo': 'bar'}, {'foo': 'digits_between:1,10'}),
        validator({'foo': '123'}, {'foo': 'digits_between:4,5'}),
        validator({'foo': '+12.3'}, {'foo': 'digits_between:1,6'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
    })
})

test('validate size', () => {
    const promises = [
        validator({'foo': 'asdad'}, {'foo': 'size:3'}),
        validator({'foo': 'anc'}, {'foo': 'size:3'}),
        validator({'foo': '123'}, {'foo': 'numeric|size:3'}),
        validator({'foo': '3'}, {'foo': 'numeric|size:3'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|size:3'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|size:4'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
    })
})

test('validate between', () => {
    const promises = [
        validator({'foo': 'asdad'}, {'foo': 'between:3,4'}),
        validator({'foo': 'anc'}, {'foo': 'between:3,5'}),
        validator({'foo': 'ancf'}, {'foo': 'between:3,5'}),
        validator({'foo': 'ancfs'}, {'foo': 'between:3,5'}),
        validator({'foo': '123'}, {'foo': 'numeric|between:50,100'}),
        validator({'foo': '3'}, {'foo': 'numeric|between:1,5'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|between:1,5'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|between:1,2'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(false)
    })
})

test('validate min', () => {
    const promises = [
        validator({'foo': '3'}, {'foo': 'min:3'}),
        validator({'foo': 'anc'}, {'foo': 'min:3'}),
        validator({'foo': '2'}, {'foo': 'numeric|min:3'}),
        validator({'foo': '5'}, {'foo': 'numeric|min:3'}),
        validator({'foo': [1, 2, 3, 4]}, {'foo': 'array|min:3'}),
        validator({'foo': [1, 2]}, {'foo': 'array|min:3'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
    })
})

test('validate max', () => {
    const promises = [
        validator({'foo': 'aslksd'}, {'foo': 'max:3'}),
        validator({'foo': 'anc'}, {'foo': 'max:3'}),
        validator({'foo': '211'}, {'foo': 'numeric|max:100'}),
        validator({'foo': '22'}, {'foo': 'numeric|max:33'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|max:4'}),
        validator({'foo': [1, 2, 3]}, {'foo': 'array|max:2'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
    })
})

test('validate in', () => {
    const promises = [
        validator({'name': 'foo'}, {'name': 'in:bar,baz'}),
        validator({'name': 0}, {'name': 'in:bar,baz'}),
        validator({'name': 'foo'}, {'name': 'in:foo,baz'}),
        validator({'name': ['foo', 'bar']}, {'name': 'array|in:foo,baz'}),
        validator({'name': ['foo', 'qux']}, {'name': 'array|in:foo,baz,qux'}),
        validator({'name': ['foo', 'bar']}, {'name': 'alpha|in:foo,bar'}),
        validator({'name': ['foo', []]}, {'name': 'array|in:foo,bar'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
    })
})

test('validate not_in', () => {
    const promises = [
        validator({'name': 'foo'}, {'name': 'not_in:bar,baz'}),
        validator({'name': 'foo'}, {'name': 'not_in:foo,baz'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
    })
})

test('validate distinct', () => {
    const promises = [
        validator({'foo': ['foo', 'foo']}, {'foo.*': 'distinct'}),
        validator({'foo': ['à', 'À']}, {'foo.*': 'distinct:ignore_case'}),
        validator({'foo': ['f/oo', 'F/OO']}, {'foo.*': 'distinct:ignore_case'}),
        validator({'foo': ['foo', 'bar']}, {'foo.*': 'distinct'}),
        validator({'foo': {'bar': {'id': 1}, 'baz': {'id': 1}}}, {'foo.*.id': 'distinct'}),
        validator({'foo': {'bar': {'id': 'qux'}, 'baz': {'id': 'QUX'}}}, {'foo.*.id': 'distinct'}),
        validator({'foo': {'bar': {'id': 'qux'}, 'baz': {'id': 'QUX'}}}, {'foo.*.id': 'distinct:ignore_case'}),
        validator({'foo': {'bar': {'id': 1}, 'baz': {'id': 2}}}, {'foo.*.id': 'distinct'}),
        validator({'foo': [{'id': 1, 'nested': {'id': 1}}]}, {'foo.*.id': 'distinct'}),
        validator({'foo': [{'id': 1}, {'id': 1}]}, {'foo.*.id': 'distinct'}),
        validator({'foo': [{'id': 1}, {'id': 2}]}, {'foo.*.id': 'distinct'}),
        validator({'cat': [{'prod': [{'id': 1}]}, {'prod': [{'id': 1}]}]}, {'cat.*.prod.*.id': 'distinct'}),
        validator({'cat': [{'prod': [{'id': 1}]}, {'prod': [{'id': 2}]}]}, {'cat.*.prod.*.id': 'distinct'}),
        validator({'cat': {'sub': [{'prod': [{'id': 1}]}, {'prod': [{'id': 2}]}]}}, {'cat.sub.*.prod.*.id': 'distinct'}),
        validator({'cat': {'sub':[{'prod':[{'id': 2}]},{'prod':[{'id': 2}]}]}}, {'cat.sub.*.prod.*.id': 'distinct'}),
        validator({'foo': ['foo', 'foo']}, {'foo.*': 'distinct'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(true)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(false)
        expect(result[15]).toBe(false)
    })
})

test('validate ip', () => {
    const promises = [
        validator({'ip': 'aslsdlks'}, {'ip': 'ip'}),
        validator({'ip': '127.0.0.1'}, {'ip': 'ip'}),
        validator({'ip': '127.0.0.1'}, {'ip': 'ipv4'}),
        validator({'ip': '::1'}, {'ip': 'ipv6'}),
        validator({'ip': '127.0.0.1'}, {'ip': 'ipv6'}),
        validator({'ip': '::1'}, {'ip': 'ipv4'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
    })
})

test('validate email', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': 'Email'}),
        validator({'x': 'foo@gmail.com'}, {'x': 'Email'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[]).toBe(false)
        expect(result[]).toBe(true)
    })
})