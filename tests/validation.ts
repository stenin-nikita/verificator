import Validator from '../src/Validator'

const validator = (data: any, rules: any): Promise<boolean> => {
    return new Validator(data, rules).passes()
}

test('empty rules skipped', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': ['alpha', [], '']}),
        validator({'x': 'aslsdlks'}, {'x': '|||required|'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
    })
})

test('alternative format', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': ['alpha', ['min', 3], ['max', 10]]}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
    })
})

test('validate nullable', () => {
    const promises = [
        validator({}, { name: 'nullable' }),
        validator({ 'name': undefined}, { name: 'nullable' }),
        validator({ 'name': null}, { name: 'nullable' }),
        validator({ 'name': true}, { name: 'nullable' }),
        validator({ 'name': false}, { name: 'nullable' }),
        validator({ 'name': 0}, { name: 'nullable' }),
        validator({ 'name': 1}, { name: 'nullable' }),
        validator({ 'name': '0'}, { name: 'nullable' }),
        validator({ 'name': '1'}, { name: 'nullable' }),
        validator({ 'name': 'test'}, { name: 'nullable' }),
        validator({ 'name': []}, { name: 'nullable' }),
        validator({ 'name': {}}, { name: 'nullable' }),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(true)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(true)
    })
})

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
        validator({'x': undefined}, {'x': 'string'}),
        validator({'x': null}, {'x': 'string'}),
        validator({'x': true}, {'x': 'string'}),
        validator({'x': false}, {'x': 'string'}),
        validator({'x': 0}, {'x': 'string'}),
        validator({'x': 1}, {'x': 'string'}),
        validator({'x': []}, {'x': 'string'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
    })
})

test('validate string', () => {
    const promises = [
        validator({'x': []}, {'x': 'array'}),
        validator({'x': undefined}, {'x': 'array'}),
        validator({'x': null}, {'x': 'array'}),
        validator({'x': true}, {'x': 'array'}),
        validator({'x': false}, {'x': 'array'}),
        validator({'x': 1}, {'x': 'array'}),
        validator({'x': 0}, {'x': 'array'}),
        validator({'x': ''}, {'x': 'array'}),
        validator({'x': 'test'}, {'x': 'array'}),
        validator({'x': {}}, {'x': 'array'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
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
        validator({'foo': 'a'}, {'foo': 'numeric'}),
        validator({'foo': '1234567a89'}, {'foo': 'numeric'}),
        validator({'foo': null}, {'foo': 'numeric'}),
        validator({'foo': undefined}, {'foo': 'numeric'}),
        validator({'foo': true}, {'foo': 'numeric'}),
        validator({'foo': false}, {'foo': 'numeric'}),
        validator({'foo': {}}, {'foo': 'numeric'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(false)
    })
})

test('validate integer', () => {
    const promises = [
        validator({'foo': 'asdad'}, {'foo': 'integer'}),
        validator({'foo': '1.23'}, {'foo': 'integer'}),
        validator({'foo': '-1'}, {'foo': 'integer'}),
        validator({'foo': '1'}, {'foo': 'integer'}),
        validator({'foo': '1234567890'}, {'foo': 'integer'}),
        validator({'foo': 123}, {'foo': 'integer'}),
        validator({'foo': -123}, {'foo': 'integer'}),
        validator({'foo': '-123'}, {'foo': 'integer'}),
        validator({'foo': 'a'}, {'foo': 'integer'}),
        validator({'foo': '1234567a89'}, {'foo': 'integer'}),
        validator({'foo': null}, {'foo': 'integer'}),
        validator({'foo': undefined}, {'foo': 'integer'}),
        validator({'foo': true}, {'foo': 'integer'}),
        validator({'foo': false}, {'foo': 'integer'}),
        validator({'foo': {}}, {'foo': 'integer'}),
        validator({'foo': '+123'}, {'foo': 'integer'}),
        validator({'foo': 12.2}, {'foo': 'integer'}),
        validator({'foo': '13.3'}, {'foo': 'integer'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(false)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(false)
        expect(result[13]).toBe(false)
        expect(result[14]).toBe(false)
        expect(result[15]).toBe(false)
        expect(result[16]).toBe(false)
        expect(result[17]).toBe(false)
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
        validator({'ip': '192.168.1.1'}, {'ip': 'ip'}),
        validator({'ip': '255.255.255.255'}, {'ip': 'ip'}),
        validator({'ip': '0.0.0.0'}, {'ip': 'ip'}),
        validator({'ip': '::1'}, {'ip': 'ip'}),
        validator({'ip': '2001:db8:0000:1:1:1:1:1'}, {'ip': 'ip'}),
        validator({'ip': '::ffff:127.0.0.1'}, {'ip': 'ip'}),
        validator({'ip': '192.168.a.1',}, {'ip': 'ip'}),
        validator({'ip': '255.255.255.256',}, {'ip': 'ip'}),
        validator({'ip': '23.a.f.234',}, {'ip': 'ip'}),
        validator({'ip': '::ffff:287.0.0.1',}, {'ip': 'ip'}),
        validator({'ip': '192.168.1.1'}, {'ip': 'ipv4'}),
        validator({'ip': '255.255.255.255'}, {'ip': 'ipv4'}),
        validator({'ip': '0.0.0.0'}, {'ip': 'ipv4'}),
        validator({'ip': '2001:db8:0000:1:1:1:1:1'}, {'ip': 'ipv4'}),
        validator({'ip': '::ffff:127.0.0.1'}, {'ip': 'ipv4'}),
        validator({'ip': '192.168.a.1'}, {'ip': 'ipv4'}),
        validator({'ip': '255.255.255.256'}, {'ip': 'ipv4'}),
        validator({'ip': '23.a.f.234'}, {'ip': 'ipv4'}),
        validator({'ip': '::ffff:287.0.0.1'}, {'ip': 'ipv4'}),
        validator({'ip': '2001:db8:0000:1:1:1:1:1'}, {'ip': 'ipv6'}),
        validator({'ip': '::ffff:127.0.0.1'}, {'ip': 'ipv6'}),
        validator({'ip': '192.168.a.1'}, {'ip': 'ipv6'}),
        validator({'ip': '255.255.255.256'}, {'ip': 'ipv6'}),
        validator({'ip': '23.a.f.234'}, {'ip': 'ipv6'}),
        validator({'ip': '192.168.1.1'}, {'ip': 'ipv6'}),
        validator({'ip': '255.255.255.255'}, {'ip': 'ipv6'}),
        validator({'ip': '0.0.0.0'}, {'ip': 'ipv6'}),
        validator({'ip': '::ffff:287.0.0.1'}, {'ip': 'ipv6'}),
    ]


    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(true)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(true)
        expect(result[12]).toBe(false)
        expect(result[13]).toBe(false)
        expect(result[14]).toBe(false)
        expect(result[15]).toBe(false)
        expect(result[16]).toBe(true)
        expect(result[17]).toBe(true)
        expect(result[18]).toBe(true)
        expect(result[19]).toBe(false)
        expect(result[20]).toBe(false)
        expect(result[21]).toBe(false)
        expect(result[22]).toBe(false)
        expect(result[23]).toBe(false)
        expect(result[24]).toBe(false)
        expect(result[25]).toBe(true)
        expect(result[26]).toBe(true)
        expect(result[27]).toBe(false)
        expect(result[28]).toBe(false)
        expect(result[29]).toBe(false)
        expect(result[30]).toBe(false)
        expect(result[31]).toBe(false)
        expect(result[32]).toBe(false)
        expect(result[33]).toBe(false)
    })
})

test('validate email', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': 'email'}),
        validator({'x': '@example.com'}, {'x': 'email'}),
        validator({'x': '@example'}, {'x': 'email'}),
        validator({'x': undefined}, {'x': 'email'}),
        validator({'x': null}, {'x': 'email'}),
        validator({'x': 'undefined'}, {'x': 'email'}),
        validator({'x': 'null'}, {'x': 'email'}),
        validator({'x': 'someone@example.c'}, {'x': 'email'}),
        validator({'x': true}, {'x': 'email'}),
        validator({'x': false}, {'x': 'email'}),
        validator({'x': 'foo@gmail.com'}, {'x': 'email'}),
        validator({'x': 'someone@example.com'}, {'x': 'email'}),
        validator({'x': 'someone@example.co'}, {'x': 'email'}),
        validator({'x': 'someone123@example.co.uk'}, {'x': 'email'}),
        validator({'x': 'Pelé@example.com'}, {'x': 'email'}),
        validator({'x': 'very.common@example.com'}, {'x': 'email'}),
        validator({'x': 'other.email-with-dash@example.com'}, {'x': 'email'}),
        validator({'x': 'disposable.style.email.with+symbol@example.com'}, {'x': 'email'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(true)
        expect(result[12]).toBe(true)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(true)
        expect(result[15]).toBe(true)
        expect(result[16]).toBe(true)
        expect(result[17]).toBe(true)
    })
})

test('validate alpha', () => {
    const promises = [
        validator({'x': 'aslsdlks'}, {'x': 'alpha'}),
        validator({'x': `aslsdlks
    1
    1`}, {'x': 'alpha'}),
        validator({'x': 'http://google.com'}, {'x': 'alpha'}),
        validator({'x': 'Continuación'}, {'x': 'alpha'}),
        validator({'x': 'ofreció su dimisión'}, {'x': 'alpha'}),
        validator({'x': '❤'}, {'x': 'alpha'}),
        validator({'x': '123'}, {'x': 'alpha'}),
        validator({'x': 123}, {'x': 'alpha'}),
        validator({'x': 'abc123'}, {'x': 'alpha'}),
        // any locale.
        validator({'x': 'سلام'}, {'x': 'alpha'}),
        validator({'x': 'Привет'}, {'x': 'alpha'}),
        // specfic locale
        validator({'x': 'peace'}, {'x': 'alpha:ar'}),
        validator({'x': 'peace'}, {'x': 'alpha:ru'}),
        // non-existant locale defaults to english validation.
        validator({'x': 'peace'}, {'x': 'alpha:blah'}),
        // non english characters.
        validator({'x': 'اين اشيائي'}, {'x': 'alpha:blah'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(true)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(false)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(false)
    })
})

test('validate alpha_num', () => {
    const promises = [
        validator({'x': 'asls13dlks'}, {'x': 'alpha_num'}),
        validator({'x': 'http://g232oogle.com'}, {'x': 'alpha_num'}),
        validator({'x': '٧٨٩'}, {'x': 'alpha_num'}),
        // any locale.
        validator({'x': 'سلام12'}, {'x': 'alpha_num'}),
        validator({'x': 'Привет12'}, {'x': 'alpha_num'}),
        // specfic locale
        validator({'x': 'peace'}, {'x': 'alpha_num:ar'}),
        validator({'x': 'peace'}, {'x': 'alpha_num:ru'}),
        // non-existant locale defaults to english validation.
        validator({'x': 'peace'}, {'x': 'alpha_num:blah'}),
        // non english characters.
        validator({'x': 'اين اشيائي'}, {'x': 'alpha_num:blah'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(false)
    })
})

test('validate alpha_dash', () => {
    const promises = [
        validator({'x': 'asls1-_3dlks'}, {'x': 'alpha_dash'}),
        validator({'x': 'http://-g232oogle.com'}, {'x': 'alpha_dash'}),
        validator({'x': '٧٨٩'}, {'x': 'alpha_dash'}),
        // any locale.
        validator({'x': 'سلا-م_'}, {'x': 'alpha_dash'}),
        validator({'x': 'Привет_-'}, {'x': 'alpha_dash'}),
        // specfic locale
        validator({'x': 'peace'}, {'x': 'alpha_dash:ar'}),
        validator({'x': 'peace'}, {'x': 'alpha_dash:ru'}),
        // non-existant locale defaults to english validation.
        validator({'x': 'peace'}, {'x': 'alpha_dash:blah'}),
        // non english characters.
        validator({'x': 'اين اشيائي'}, {'x': 'alpha_dash:blah'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(false)
    })
})

test('validate regex', () => {
    const promises = [
        validator({'x': 'asdasdf'}, {'x': [['regex', /^([a-z])+$/i]]}),
        validator({'x': 'aasd234fsd1'}, {'x': [['regex', /^([a-z])+$/i]]}),
        validator({'x': 'a,b'}, {'x': [['regex', /^a,b$/i]]}),
        validator({'x': '12'}, {'x': [['regex', /^12$/i]]}),
        validator({'x': 123}, {'x': [['regex', /^123$/i]]}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
    })
})

test('validate date and date_format', () => {
    const promises = [
        validator({'x': '2000-01-01'}, {'x': 'date'}),
        validator({'x': '01/01/2000'}, {'x': 'date'}),
        validator({'x': '1325376000'}, {'x': 'date'}),
        validator({'x': 'Not a date'}, {'x': 'date'}),
        validator({'x': ['Not', 'a', 'date']}, {'x': 'date'}),
        validator({'x': new Date()}, {'x': 'date'}),
        validator({'x': '2000-01-01'}, {'x': 'date_format:YYYY-MM-DD'}),
        validator({'x': '01/01/2001'}, {'x': 'date_format:YYYY-MM-DD'}),
        validator({'x': '22000-01-01'}, {'x': 'date_format:YYYY-MM-DD'}),
        validator({'x': '00-01-01'}, {'x': 'date_format:YYYY-MM-DD'}),
        validator({'x': ['Not', 'a', 'date']}, {'x': 'date_format:YYYY-MM-DD'}),
        validator({'x': '2013-02'}, {'x': 'date_format:YYYY-MM'}),
        validator({'x': '2000-01-01T00:00:00Z'}, {'x': 'date_format:YYYY-MM-DD[T]HH:mm:ss[Z]'}),
        validator({'x': '2000-01-01T00:00:00+0000'}, {'x': 'date_format:YYYY-MM-DD[T]HH:mm:ssZZ'}),
        validator({'x': '2000-01-01T00:00:00+00:00'}, {'x': 'date_format:YYYY-MM-DD[T]HH:mm:ssZ'}), // with +00:30 failed ???
        validator({'x': '2000-01-01 17:43:59'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss'}),
        validator({'x': '2000-01-01 17:43:59'}, {'x': 'date_format:HH:mm:ss'}),
        validator({'x': '17:43:59'}, {'x': 'date_format:HH:mm:ss'}),
        validator({'x': '17:43:59'}, {'x': 'date_format:HH:mm'}),
        validator({'x': '17:43'}, {'x': 'date_format:HH:mm'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(false)
        expect(result[11]).toBe(true)
        expect(result[12]).toBe(true)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(true)
        expect(result[15]).toBe(true)
        expect(result[16]).toBe(false)
        expect(result[17]).toBe(true)
        expect(result[18]).toBe(false)
        expect(result[19]).toBe(true)
    })
})

test('validate date_equals', () => {
    const promises = [
        validator({'x': '2000-01-01'}, {'x': 'date_equals:2000-01-01'}),
        validator({'x': new Date(2000, 0, 1)}, {'x': 'date_equals:2000-01-01'}),
        validator({'x': new Date(2000, 0, 1)}, {'x': 'date_equals:2001-01-01'}),
        validator({'start': new Date(2000, 0, 1), 'ends': new Date(2000, 0, 1)}, {'ends': 'date_equals:start'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|date_equals:2012-01-01 17:44:00'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|date_equals:2012-01-01 17:43:59'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|date_equals:2012-01-01 17:44:01'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|date_equals:17:44:00'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|date_equals:17:43:59'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|date_equals:17:44:01'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|date_equals:17:44'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|date_equals:17:43'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|date_equals:17:45'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(false)
    })
})

test('validate before and after', () => {
    const promises = [
        validator({'x': '2000-01-01'}, {'x': 'before:2012-01-01'}),
        validator({'x': ['2000-01-01']}, {'x': 'before:2012-01-01'}),
        validator({'x': new Date(2000, 0, 1)}, {'x': 'before:2012-01-01'}),
        validator({'x': [new Date(2000, 0, 1)]}, {'x': 'before:2012-01-01'}),
        validator({'x': '2012-01-01'}, {'x': 'after:2000-01-01'}),
        validator({'x': ['2012-01-01']}, {'x': 'after:2000-01-01'}),
        validator({'x': new Date(2012, 0, 1)}, {'x': 'after:2000-01-01'}),
        validator({'x': [new Date(2012, 0, 1)]}, {'x': 'after:2000-01-01'}),
        validator({'start': '2012-01-01', 'ends': '2013-01-01'}, {'start': 'after:2000-01-01', 'ends': 'after:start'}),
        validator({'start': '2012-01-01', 'ends': '2000-01-01'}, {'start': 'after:2000-01-01', 'ends': 'after:start'}),
        validator({'start': '2012-01-01', 'ends': '2013-01-01'}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'start': '2012-01-01', 'ends': '2000-01-01'}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'x': new Date(2000, 0, 1)}, {'x': 'before:2012-01-01'}),
        validator({'start': new Date(2012, 0, 1), 'ends': new Date(2013, 0, 1)}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'start': '2012-01-01', 'ends': new Date(2013, 0, 1)}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'start': new Date(2012, 0, 1), 'ends': new Date(2000, 0, 1)}, {'start': 'after:2000-01-01', 'ends': 'after:start'}),
        validator({'x': '2012-01-01 17:43:59'}, {'x': 'before:2012-01-01 17:44|after:2012-01-01 17:43:58'}),
        validator({'x': '2012-01-01 17:44:01'}, {'x': 'before:2012-01-01 17:44:02|after:2012-01-01 17:44'}),
        validator({'x': '2012-01-01 17:44'}, {'x': 'before:2012-01-01 17:44:00'}),
        validator({'x': '2012-01-01 17:44'}, {'x': 'after:2012-01-01 17:44:00'}),
        validator({'x': '17:43:59'}, {'x': 'before:17:44|after:17:43:58'}),
        validator({'x': '17:44:01'}, {'x': 'before:17:44:02|after:17:44'}),
        validator({'x': '17:44'}, {'x': 'before:17:44:00'}),
        validator({'x': '17:44'}, {'x': 'after:17:44:00'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(true)
        expect(result[5]).toBe(false)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(true)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(true)
        expect(result[15]).toBe(false)
        expect(result[16]).toBe(true)
        expect(result[17]).toBe(true)
        expect(result[18]).toBe(false)
        expect(result[19]).toBe(false)
        expect(result[20]).toBe(true)
        expect(result[21]).toBe(true)
        expect(result[22]).toBe(false)
        expect(result[23]).toBe(false)
    })
})

test('validate before and after with format', () => {
    const promises = [
        validator({'x': '31/12/2000'}, {'x': 'before:31/02/2012'}),
        validator({'x': ['31/12/2000']}, {'x': 'before:31/02/2012'}),
        validator({'x': '31/12/2000'}, {'x': 'date_format:DD/MM/YYYY|before:31/12/2012'}),
        validator({'x': '31/12/2012'}, {'x': 'after:31/12/2000'}),
        validator({'x': ['31/12/2012']}, {'x': 'after:31/12/2000'}),
        validator({'x': '31/12/2012'}, {'x': 'date_format:DD/MM/YYYY|after:31/12/2000'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2013'}, {'start': 'after:01/01/2000', 'ends': 'after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2013'}, {'start': 'date_format:DD/MM/YYYY|after:31/12/2000', 'ends': 'date_format:DD/MM/YYYY|after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2000'}, {'start': 'after:31/12/2000', 'ends': 'after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2000'}, {'start': 'date_format:DD/MM/YYYY|after:31/12/2000', 'ends': 'date_format:DD/MM/YYYY|after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2013'}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2013'}, {'start': 'date_format:DD/MM/YYYY|before:ends', 'ends': 'date_format:DD/MM/YYYY|after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2000'}, {'start': 'before:ends', 'ends': 'after:start'}),
        validator({'start': '31/12/2012', 'ends': '31/12/2000'}, {'start': 'date_format:DD/MM/YYYY|before:ends', 'ends': 'date_format:DD/MM/YYYY|after:start'}),
        validator({'start': 'invalid', 'ends': 'invalid'}, {'start': 'date_format:DD/MM/YYYY|before:ends', 'ends': 'date_format:DD/MM/YYYY|after:start'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|before:2012-01-01 17:44:01|after:2012-01-01 17:43:59'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|before:2012-01-01 17:44:00'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|after:2012-01-01 17:44:00'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|before:17:44:01|after:17:43:59'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|before:17:44:00'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|after:17:44:00'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|before:17:45|after:17:43'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|before:17:44'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|after:17:44'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(false)
        expect(result[7]).toBe(true)
        expect(result[8]).toBe(false)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(false)
        expect(result[11]).toBe(true)
        expect(result[12]).toBe(false)
        expect(result[13]).toBe(false)
        expect(result[14]).toBe(false)
        expect(result[15]).toBe(true)
        expect(result[16]).toBe(false)
        expect(result[17]).toBe(false)
        expect(result[18]).toBe(true)
        expect(result[19]).toBe(false)
        expect(result[20]).toBe(false)
        expect(result[21]).toBe(true)
        expect(result[22]).toBe(false)
        expect(result[23]).toBe(false)
    })
})

test('validate weak before and after', () => {
    const promises = [
        validator({'x': '2012-01-15'}, {'x': 'before_or_equal:2012-01-15'}),
        validator({'x': '2012-01-15'}, {'x': 'before_or_equal:2012-01-16'}),
        validator({'x': '2012-01-15'}, {'x': 'before_or_equal:2012-01-14'}),
        validator({'x': '15/01/2012'}, {'x': 'date_format:DD/MM/YYYY|before_or_equal:15/01/2012'}),
        validator({'x': '15/01/2012'}, {'x': 'date_format:DD/MM/YYYY|before_or_equal:14/01/2012'}),
        validator({'x': '2012-01-15'}, {'x': 'after_or_equal:2012-01-15'}),
        validator({'x': '2012-01-15'}, {'x': 'after_or_equal:2012-01-14'}),
        validator({'x': '2012-01-15'}, {'x': 'after_or_equal:2012-01-16'}),
        validator({'x': '15/01/2012'}, {'x': 'date_format:DD/MM/YYYY|after_or_equal:15/01/2012'}),
        validator({'x': '15/01/2012'}, {'x': 'date_format:DD/MM/YYYY|after_or_equal:16/01/2012'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|before_or_equal:2012-01-01 17:44:00|after_or_equal:2012-01-01 17:44:00'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|before_or_equal:2012-01-01 17:43:59'}),
        validator({'x': '2012-01-01 17:44:00'}, {'x': 'date_format:YYYY-MM-DD HH:mm:ss|after_or_equal:2012-01-01 17:44:01'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|before_or_equal:17:44:00|after_or_equal:17:44:00'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|before_or_equal:17:43:59'}),
        validator({'x': '17:44:00'}, {'x': 'date_format:HH:mm:ss|after_or_equal:17:44:01'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|before_or_equal:17:44|after_or_equal:17:44'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|before_or_equal:17:43'}),
        validator({'x': '17:44'}, {'x': 'date_format:HH:mm|after_or_equal:17:45'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(result[3]).toBe(true)
        expect(result[4]).toBe(false)
        expect(result[5]).toBe(true)
        expect(result[6]).toBe(true)
        expect(result[7]).toBe(false)
        expect(result[8]).toBe(true)
        expect(result[9]).toBe(false)
        expect(result[10]).toBe(true)
        expect(result[11]).toBe(false)
        expect(result[12]).toBe(false)
        expect(result[13]).toBe(true)
        expect(result[14]).toBe(false)
        expect(result[15]).toBe(false)
        expect(result[16]).toBe(true)
        expect(result[17]).toBe(false)
        expect(result[18]).toBe(false)
    })
})

test('validate url with valid url', () => {
    const urls = [
        'aaa://fully.qualified.domain/path',
        'aaas://fully.qualified.domain/path',
        'about://fully.qualified.domain/path',
        'acap://fully.qualified.domain/path',
        'acct://fully.qualified.domain/path',
        'acr://fully.qualified.domain/path',
        'adiumxtra://fully.qualified.domain/path',
        'afp://fully.qualified.domain/path',
        'afs://fully.qualified.domain/path',
        'aim://fully.qualified.domain/path',
        'apt://fully.qualified.domain/path',
        'attachment://fully.qualified.domain/path',
        'aw://fully.qualified.domain/path',
        'barion://fully.qualified.domain/path',
        'beshare://fully.qualified.domain/path',
        'bitcoin://fully.qualified.domain/path',
        'blob://fully.qualified.domain/path',
        'bolo://fully.qualified.domain/path',
        'callto://fully.qualified.domain/path',
        'cap://fully.qualified.domain/path',
        'chrome://fully.qualified.domain/path',
        'chrome-extension://fully.qualified.domain/path',
        'cid://fully.qualified.domain/path',
        'coap://fully.qualified.domain/path',
        'coaps://fully.qualified.domain/path',
        'com-eventbrite-attendee://fully.qualified.domain/path',
        'content://fully.qualified.domain/path',
        'crid://fully.qualified.domain/path',
        'cvs://fully.qualified.domain/path',
        'data://fully.qualified.domain/path',
        'dav://fully.qualified.domain/path',
        'dict://fully.qualified.domain/path',
        'dlna-playcontainer://fully.qualified.domain/path',
        'dlna-playsingle://fully.qualified.domain/path',
        'dns://fully.qualified.domain/path',
        'dntp://fully.qualified.domain/path',
        'dtn://fully.qualified.domain/path',
        'dvb://fully.qualified.domain/path',
        'ed2k://fully.qualified.domain/path',
        'example://fully.qualified.domain/path',
        'facetime://fully.qualified.domain/path',
        'fax://fully.qualified.domain/path',
        'feed://fully.qualified.domain/path',
        'feedready://fully.qualified.domain/path',
        'file://fully.qualified.domain/path',
        'filesystem://fully.qualified.domain/path',
        'finger://fully.qualified.domain/path',
        'fish://fully.qualified.domain/path',
        'ftp://fully.qualified.domain/path',
        'geo://fully.qualified.domain/path',
        'gg://fully.qualified.domain/path',
        'git://fully.qualified.domain/path',
        'gizmoproject://fully.qualified.domain/path',
        'go://fully.qualified.domain/path',
        'gopher://fully.qualified.domain/path',
        'gtalk://fully.qualified.domain/path',
        'h323://fully.qualified.domain/path',
        'ham://fully.qualified.domain/path',
        'hcp://fully.qualified.domain/path',
        'http://fully.qualified.domain/path',
        'https://fully.qualified.domain/path',
        'iax://fully.qualified.domain/path',
        'icap://fully.qualified.domain/path',
        'icon://fully.qualified.domain/path',
        'im://fully.qualified.domain/path',
        'imap://fully.qualified.domain/path',
        'info://fully.qualified.domain/path',
        'iotdisco://fully.qualified.domain/path',
        'ipn://fully.qualified.domain/path',
        'ipp://fully.qualified.domain/path',
        'ipps://fully.qualified.domain/path',
        'irc://fully.qualified.domain/path',
        'irc6://fully.qualified.domain/path',
        'ircs://fully.qualified.domain/path',
        'iris://fully.qualified.domain/path',
        'iris.beep://fully.qualified.domain/path',
        'iris.lwz://fully.qualified.domain/path',
        'iris.xpc://fully.qualified.domain/path',
        'iris.xpcs://fully.qualified.domain/path',
        'itms://fully.qualified.domain/path',
        'jabber://fully.qualified.domain/path',
        'jar://fully.qualified.domain/path',
        'jms://fully.qualified.domain/path',
        'keyparc://fully.qualified.domain/path',
        'lastfm://fully.qualified.domain/path',
        'ldap://fully.qualified.domain/path',
        'ldaps://fully.qualified.domain/path',
        'magnet://fully.qualified.domain/path',
        'mailserver://fully.qualified.domain/path',
        'maps://fully.qualified.domain/path',
        'market://fully.qualified.domain/path',
        'message://fully.qualified.domain/path',
        'mid://fully.qualified.domain/path',
        'mms://fully.qualified.domain/path',
        'modem://fully.qualified.domain/path',
        'ms-help://fully.qualified.domain/path',
        'ms-settings://fully.qualified.domain/path',
        'ms-settings-airplanemode://fully.qualified.domain/path',
        'ms-settings-bluetooth://fully.qualified.domain/path',
        'ms-settings-camera://fully.qualified.domain/path',
        'ms-settings-cellular://fully.qualified.domain/path',
        'ms-settings-cloudstorage://fully.qualified.domain/path',
        'ms-settings-emailandaccounts://fully.qualified.domain/path',
        'ms-settings-language://fully.qualified.domain/path',
        'ms-settings-location://fully.qualified.domain/path',
        'ms-settings-lock://fully.qualified.domain/path',
        'ms-settings-nfctransactions://fully.qualified.domain/path',
        'ms-settings-notifications://fully.qualified.domain/path',
        'ms-settings-power://fully.qualified.domain/path',
        'ms-settings-privacy://fully.qualified.domain/path',
        'ms-settings-proximity://fully.qualified.domain/path',
        'ms-settings-screenrotation://fully.qualified.domain/path',
        'ms-settings-wifi://fully.qualified.domain/path',
        'ms-settings-workplace://fully.qualified.domain/path',
        'msnim://fully.qualified.domain/path',
        'msrp://fully.qualified.domain/path',
        'msrps://fully.qualified.domain/path',
        'mtqp://fully.qualified.domain/path',
        'mumble://fully.qualified.domain/path',
        'mupdate://fully.qualified.domain/path',
        'mvn://fully.qualified.domain/path',
        'news://fully.qualified.domain/path',
        'nfs://fully.qualified.domain/path',
        'ni://fully.qualified.domain/path',
        'nih://fully.qualified.domain/path',
        'nntp://fully.qualified.domain/path',
        'notes://fully.qualified.domain/path',
        'oid://fully.qualified.domain/path',
        'opaquelocktoken://fully.qualified.domain/path',
        'pack://fully.qualified.domain/path',
        'palm://fully.qualified.domain/path',
        'paparazzi://fully.qualified.domain/path',
        'pkcs11://fully.qualified.domain/path',
        'platform://fully.qualified.domain/path',
        'pop://fully.qualified.domain/path',
        'pres://fully.qualified.domain/path',
        'prospero://fully.qualified.domain/path',
        'proxy://fully.qualified.domain/path',
        'psyc://fully.qualified.domain/path',
        'query://fully.qualified.domain/path',
        'redis://fully.qualified.domain/path',
        'rediss://fully.qualified.domain/path',
        'reload://fully.qualified.domain/path',
        'res://fully.qualified.domain/path',
        'resource://fully.qualified.domain/path',
        'rmi://fully.qualified.domain/path',
        'rsync://fully.qualified.domain/path',
        'rtmfp://fully.qualified.domain/path',
        'rtmp://fully.qualified.domain/path',
        'rtsp://fully.qualified.domain/path',
        'rtsps://fully.qualified.domain/path',
        'rtspu://fully.qualified.domain/path',
        'secondlife://fully.qualified.domain/path',
        'service://fully.qualified.domain/path',
        'session://fully.qualified.domain/path',
        'sftp://fully.qualified.domain/path',
        'sgn://fully.qualified.domain/path',
        'shttp://fully.qualified.domain/path',
        'sieve://fully.qualified.domain/path',
        'sip://fully.qualified.domain/path',
        'sips://fully.qualified.domain/path',
        'skype://fully.qualified.domain/path',
        'smb://fully.qualified.domain/path',
        'sms://fully.qualified.domain/path',
        'smtp://fully.qualified.domain/path',
        'snews://fully.qualified.domain/path',
        'snmp://fully.qualified.domain/path',
        'soap.beep://fully.qualified.domain/path',
        'soap.beeps://fully.qualified.domain/path',
        'soldat://fully.qualified.domain/path',
        'spotify://fully.qualified.domain/path',
        'ssh://fully.qualified.domain/path',
        'steam://fully.qualified.domain/path',
        'stun://fully.qualified.domain/path',
        'stuns://fully.qualified.domain/path',
        'submit://fully.qualified.domain/path',
        'svn://fully.qualified.domain/path',
        'tag://fully.qualified.domain/path',
        'teamspeak://fully.qualified.domain/path',
        'tel://fully.qualified.domain/path',
        'teliaeid://fully.qualified.domain/path',
        'telnet://fully.qualified.domain/path',
        'tftp://fully.qualified.domain/path',
        'things://fully.qualified.domain/path',
        'thismessage://fully.qualified.domain/path',
        'tip://fully.qualified.domain/path',
        'tn3270://fully.qualified.domain/path',
        'turn://fully.qualified.domain/path',
        'turns://fully.qualified.domain/path',
        'tv://fully.qualified.domain/path',
        'udp://fully.qualified.domain/path',
        'unreal://fully.qualified.domain/path',
        'urn://fully.qualified.domain/path',
        'ut2004://fully.qualified.domain/path',
        'vemmi://fully.qualified.domain/path',
        'ventrilo://fully.qualified.domain/path',
        'videotex://fully.qualified.domain/path',
        'view-source://fully.qualified.domain/path',
        'wais://fully.qualified.domain/path',
        'webcal://fully.qualified.domain/path',
        'ws://fully.qualified.domain/path',
        'wss://fully.qualified.domain/path',
        'wtai://fully.qualified.domain/path',
        'wyciwyg://fully.qualified.domain/path',
        'xcon://fully.qualified.domain/path',
        'xcon-userid://fully.qualified.domain/path',
        'xfire://fully.qualified.domain/path',
        'xmlrpc.beep://fully.qualified.domain/path',
        'xmlrpc.beeps://fully.qualified.domain/path',
        'xmpp://fully.qualified.domain/path',
        'xri://fully.qualified.domain/path',
        'ymsgr://fully.qualified.domain/path',
        'z39.50://fully.qualified.domain/path',
        'z39.50r://fully.qualified.domain/path',
        'z39.50s://fully.qualified.domain/path',
        'http://a.pl',
        'http://local.dev',
        'http://google.com',
        'http://www.google.com',
        'https://google.com',
        'http://illuminate.dev',
        'https://laravel.com/?',
        'http://президент.рф/',
        'http://스타벅스코리아.com',
        'http://xn--d1abbgf6aiiy.xn--p1ai/',
        'https://laravel.com?',
        'https://laravel.com?q=1',
        'https://laravel.com/?q=1',
        'https://laravel.com#',
        'https://laravel.com#fragment',
        'https://laravel.com/#fragment',
    ]

    const promises = urls.map(url => validator({'x': url}, {'x': 'url'}))

    return Promise.all(promises).then(result => {
        result.forEach(valid => {
            expect(valid).toBe(true)
        })
    })
})

test('validate url with invalid url', () => {
    const urls = [
        'aslsdlks',
        'google.com',
        '://google.com',
        'http ://google.com',
        'http:/google.com',
        'http://goog_le.com',
        'http://google.com::aa',
        'http://google.com:aa',
        'http://127.0.0.1:aa',
        'http://::1',
        'foo://bar',
        'javascript://test%0Aalert(321)',
        // localhost not supported
        'http://localhost/url.php',
        'http://localhost',
    ]

    const promises = urls.map(url => validator({'x': url}, {'x': 'url'}))

    return Promise.all(promises).then(result => {
        result.forEach(valid => {
            expect(valid).toBe(false)
        })
    })
})

test('validate url require protocol', () => {
    const promises = [
        validator({'x': 'google.com'}, {'x': 'url:1'}),
        validator({'x': 'https://google.com'}, {'x': 'url:1'}),
        validator({'x': 'google.com'}, {'x': 'url:0'}),
        validator({'x': 'https://google.com'}, {'x': 'url:0'})
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(true)
    })
})

test('validate filled', () => {
    const promises = [
        validator({}, {'name': 'filled'}),
        validator({'name': ''}, {'name': 'filled'}),
        validator({'foo': [{'id': 1}, {}]}, {'foo.*.id': 'filled'}),
        validator({'foo': [{'id': ''}]}, {'foo.*.id': 'filled'}),
        validator({'foo': [{'id': null}]}, {'foo.*.id': 'filled'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
    })
})

test('validate nested array with common parent child key', () => {
    const promises = [
        validator({
            'products': [
                {
                    'price': 2,
                    'options': [
                        {'price': 1},
                    ],
                },
                {
                    'price': 2,
                    'options': [
                        {'price': 0},
                    ],
                },
            ],
        }, {'products.*.price': 'numeric|min:1'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
    })
})

test('validate nested array with non numeric keys', () => {
    const promises = [
        validator({'item_amounts': {'item_123': 2}}, {'item_amounts.*': 'numeric|min:1'}),
        validator({'item_amounts': {'item_123': 2}}, {'item_amounts.*': 'numeric|min:5'}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
    })
})

test('validate implicit each with asterisks confirmed', () => {
    const validators = [
        // confirmed passes
        new Validator({'foo':[
            {'password': 'foo0', 'password_confirmation': 'foo0'},
            {'password': 'foo1', 'password_confirmation': 'foo1'},
        ]}, {'foo.*.password': 'confirmed'}),
        // nested confirmed passes
        new Validator({'foo': [
            {'bar': [
                {'password': 'bar0', 'password_confirmation': 'bar0'},
                {'password': 'bar1', 'password_confirmation': 'bar1'},
            ]},
            {'bar': [
                {'password': 'bar2', 'password_confirmation': 'bar2'},
                {'password': 'bar3', 'password_confirmation': 'bar3'},
            ]},
        ]}, {'foo.*.bar.*.password': 'confirmed'}),
        // confirmed fails
        new Validator({'foo': [
            {'password': 'foo0', 'password_confirmation': 'bar0'},
            {'password': 'foo1'},
        ]}, {'foo.*.password': 'confirmed'}),
        // nested confirmed fails
        new Validator({'foo': [
            {'bar': [
                {'password': 'bar0'},
                {'password': 'bar1', 'password_confirmation': 'bar2'},
            ]},
        ]}, {'foo.*.bar.*.password': 'confirmed'}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.password')).toBe(true)
        expect(validators[2].errors.has('foo.1.password')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.password')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.password')).toBe(true)
    })
})

test('validate implicit each with asterisks different', () => {
    const validators = [
        // different passes
        new Validator({'foo': [
            {'name': 'foo', 'last': 'bar'},
            {'name': 'bar', 'last': 'foo'},
        ]}, {'foo.*.name': ['different:foo.*.last']}),
        // nested different passes
        new Validator({'foo': [
            {'bar': [
                {'name': 'foo', 'last': 'bar'},
                {'name': 'bar', 'last': 'foo'},
            ]},
        ]}, {'foo.*.bar.*.name': ['different:foo.*.bar.*.last']}),
        // different fails
        new Validator({'foo': [
            {'name': 'foo', 'last': 'foo'},
            {'name': 'bar', 'last': 'bar'},
        ]}, {'foo.*.name': ['different:foo.*.last']}),
        // nested different fails
        new Validator({'foo': [
            {'bar': [
                {'name': 'foo', 'last': 'foo'},
                {'name': 'bar', 'last': 'bar'},
            ]},
        ]}, {'foo.*.bar.*.name': ['different:foo.*.bar.*.last']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks same', () => {
    const validators = [
        // same passes
        new Validator({'foo': [
            {'name': 'foo', 'last': 'foo'},
            {'name': 'bar', 'last': 'bar'},
        ]}, {'foo.*.name': ['same:foo.*.last']}),
        // nested same passes
        new Validator({'foo': [
            {'bar': [
                {'name': 'foo', 'last': 'foo'},
                {'name': 'bar', 'last': 'bar'},
            ]},
        ]}, {'foo.*.bar.*.name': ['same:foo.*.bar.*.last']}),
        // same fails
        new Validator({'foo': [
            {'name': 'foo', 'last': 'bar'},
            {'name': 'bar', 'last': 'foo'},
        ]}, {'foo.*.name': ['same:foo.*.last']}),
        // nested same fails
        new Validator({'foo': [
            {'bar': [
                {'name': 'foo', 'last': 'bar'},
                {'name': 'bar', 'last': 'foo'},
            ]},
        ]}, {'foo.*.bar.*.name': ['same:foo.*.bar.*.last']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required', () => {
    const validators = [
        // required passes
        new Validator({'foo': [
            {'name': 'first'},
            {'name': 'second'},
        ]}, {'foo.*.name': ['required']}),
        // nested required passes
        new Validator({'foo': [
            {'name': 'first'},
            {'name': 'second'},
        ]}, {'foo.*.name': ['required']}),
        // required fails
        new Validator({'foo': [
            {'name': null},
            {'name': null, 'last': 'last'},
        ]}, {'foo.*.name': ['required']}),
        // nested required fails
        new Validator({'foo': [
            {'bar': [
                {'name': null},
                {'name': null},
            ]},
        ]}, {'foo.*.bar.*.name': ['required']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_if', () => {
    const validators = [
        // required_if passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'foo'},
            {'last': 'bar'},
        ]}, {'foo.*.name': ['required_if:foo.*.last,foo']}),
        // nested required_if passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'foo'},
            {'last': 'bar'},
        ]}, {'foo.*.name': ['required_if:foo.*.last,foo']}),
        // required_if fails
        new Validator({'foo': [
            {'name': null, 'last': 'foo'},
            {'name': null, 'last': 'foo'},
        ]}, {'foo.*.name': ['required_if:foo.*.last,foo']}),
        // nested required_if fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'last': 'foo'},
                {'name': null, 'last': 'foo'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_if:foo.*.bar.*.last,foo']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_unless', () => {
    const validators = [
        // required_unless passes
        new Validator({'foo': [
            {'name': null, 'last': 'foo'},
            {'name': 'second', 'last': 'bar'},
        ]}, {'foo.*.name': ['required_unless:foo.*.last,foo']}),
        // nested required_unless passes
        new Validator({'foo': [
            {'name': null, 'last': 'foo'},
            {'name': 'second', 'last': 'foo'},
        ]}, {'foo.*.bar.*.name': ['required_unless:foo.*.bar.*.last,foo']}),
        // required_unless fails
        new Validator({'foo': [
            {'name': null, 'last': 'baz'},
            {'name': null, 'last': 'bar'},
        ]}, {'foo.*.name': ['required_unless:foo.*.last,foo']}),
        // nested required_unless fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'last': 'bar'},
                {'name': null, 'last': 'bar'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_unless:foo.*.bar.*.last,foo']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_with', () => {
    const validators = [
        // required_with passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'last'},
            {'name': 'second', 'last': 'last'},
        ]}, {'foo.*.name': ['required_with:foo.*.last']}),
        // nested required_with passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'last'},
            {'name': 'second', 'last': 'last'},
        ]}, {'foo.*.name': ['required_with:foo.*.last']}),
        // required_with fails
        new Validator({'foo': [
            {'name': null, 'last': 'last'},
            {'name': null, 'last': 'last'},
        ]}, {'foo.*.name': ['required_with:foo.*.last']}),
        new Validator({'fields': {
            'fr': {'name': '', 'content': 'ragnar'},
            'es': {'name': '', 'content': 'lagertha'},
        }}, {'fields.*.name': 'required_with:fields.*.content'}),
        // nested required_with fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'last': 'last'},
                {'name': null, 'last': 'last'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_with:foo.*.bar.*.last']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(result[4]).toBe(false)
        expect(validators[4].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[4].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_with_all', () => {
    const validators = [
        // required_with_all passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'last', 'middle': 'middle'},
            {'name': 'second', 'last': 'last', 'middle': 'middle'},
        ]}, {'foo.*.name': ['required_with_all:foo.*.last,foo.*.middle']}),
        // nested required_with_all passes
        new Validator({'foo': [
            {'name': 'first', 'last': 'last', 'middle': 'middle'},
            {'name': 'second', 'last': 'last', 'middle': 'middle'},
        ]}, {'foo.*.name': ['required_with_all:foo.*.last,foo.*.middle']}),
        // required_with_all fails
        new Validator({'foo': [
            {'name': null, 'last': 'last', 'middle': 'middle'},
            {'name': null, 'last': 'last', 'middle': 'middle'},
        ]}, {'foo.*.name': ['required_with_all:foo.*.last,foo.*.middle']}),
        // nested required_with_all fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'last': 'last', 'middle': 'middle'},
                {'name': null, 'last': 'last', 'middle': 'middle'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_with_all:foo.*.bar.*.last,foo.*.bar.*.middle']}),
    ]

    const promises = validators.map(validator => validator.passes())
    
    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_without', () => {
    const validators = [
        // required_without passes
        new Validator({'foo': [
            {'name': 'first', 'middle': 'middle'},
            {'name': 'second', 'last': 'last'},
        ]}, {'foo.*.name': ['required_without:foo.*.last,foo.*.middle']}),
        // nested required_without passes
        new Validator({'foo': [
            {'name': 'first', 'middle': 'middle'},
            {'name': 'second', 'last': 'last'},
        ]}, {'foo.*.name': ['required_without:foo.*.last,foo.*.middle']}),
        // required_without fails
        new Validator({'foo': [
            {'name': null, 'last': 'last'},
            {'name': null, 'middle': 'middle'},
        ]}, {'foo.*.name': ['required_without:foo.*.last,foo.*.middle']}),
        // nested required_without fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'last': 'last'},
                {'name': null, 'middle': 'middle'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_without:foo.*.bar.*.last,foo.*.bar.*.middle']}),
    ]

    const promises = validators.map(validator => validator.passes())

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks required_without_all', () => {
    const validators = [
        // required_without_all passes
        new Validator({'foo': [
            {'name': 'first'},
            {'name': null, 'middle': 'middle'},
            {'name': null, 'middle': 'middle', 'last': 'last'},
        ]}, {'foo.*.name': ['required_without_all:foo.*.last,foo.*.middle']}),
        // required_without_all fails
        // nested required_without_all passes
        new Validator({'foo': [
            {'name': 'first'},
            {'name': null, 'middle': 'middle'},
            {'name': null, 'middle': 'middle', 'last': 'last'},
        ]}, {'foo.*.name': ['required_without_all:foo.*.last,foo.*.middle']}),
        new Validator({'foo': [
            {'name': null, 'foo': 'foo', 'bar': 'bar'},
            {'name': null, 'foo': 'foo', 'bar': 'bar'},
        ]}, {'foo.*.name': ['required_without_all:foo.*.last,foo.*.middle']}),
        // nested required_without_all fails
        new Validator({'foo': [
            {'bar': [
                {'name': null, 'foo': 'foo', 'bar': 'bar'},
                {'name': null, 'foo': 'foo', 'bar': 'bar'},
            ]},
        ]}, {'foo.*.bar.*.name': ['required_without_all:foo.*.bar.*.last,foo.*.bar.*.middle']}),
    ]

    const promises = validators.map(validator => validator.passes())

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(true)
        expect(result[2]).toBe(false)
        expect(validators[2].errors.has('foo.0.name')).toBe(true)
        expect(validators[2].errors.has('foo.1.name')).toBe(true)
        expect(result[3]).toBe(false)
        expect(validators[3].errors.has('foo.0.bar.0.name')).toBe(true)
        expect(validators[3].errors.has('foo.0.bar.1.name')).toBe(true)
    })
})

test('validate implicit each with asterisks before and after', () => {
    const promises = [
        validator({'foo': [{'start': '2016-04-19', 'end': '2017-04-19'}]}, {'foo.*.start': ['before:foo.*.end']}),
        validator({'foo': [{'start': '2016-04-19', 'end': '2017-04-19'}]}, {'foo.*.end': ['before:foo.*.start']}),
        validator({'foo': [{'start': '2016-04-19', 'end': '2017-04-19'}]}, {'foo.*.end': ['after:foo.*.start']}),
        validator({'foo': [{'start': '2016-04-19', 'end': '2017-04-19'}]}, {'foo.*.start': ['after:foo.*.end']}),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(true)
        expect(result[1]).toBe(false)
        expect(result[2]).toBe(true)
        expect(result[3]).toBe(false)
    })
})

test('validate using setters with implicit rules', () => {
    const promises = [
        new Validator({'foo': ['a', 'b', 'c']}, {'foo.*': 'string'}).setData({'foo': ['a', 'b', 'c', 4]}).passes(),
        new Validator({'foo': ['a', 'b', 'c']}, {'foo.*': 'string'}).setRules({'foo.*': 'integer'}).passes(),
    ]

    return Promise.all(promises).then(result => {
        expect(result[0]).toBe(false)
        expect(result[1]).toBe(false)
    })
})