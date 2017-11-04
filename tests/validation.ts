import Validator from '../src/Validator'
import locale from '../locale/ru'

test('validate present', () => {
    expect.assertions(9)

    new Validator({}, { name: 'present' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({}, { name: 'present|nullable' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ name: null }, { name: 'present|nullable' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ name: '' }, { name: 'present' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ foo: [ { id: 1 }, {} ] }, { name: 'present' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ foo: [ { id: 1 }, { name: 'a' } ] }, { 'foo.*.id': 'present' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ foo: [ { id: 1 }, {} ] }, { 'foo.*.id': 'present' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ foo: [ { id: 1 }, { id: '' } ] }, { 'foo.*.id': 'present' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ foo: [ { id: 1 }, { id: null } ] }, { 'foo.*.id': 'present' }, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required', () => {
    expect.assertions(3)

    new Validator({}, { name: 'required' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ name: '' }, { name: 'required' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ name: 'foo' }, { name: 'required' }, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required with', () => {
    expect.assertions(5)

    new Validator({ 'first': 'Nikita' }, { 'last': 'required_with:first' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': 'Nikita', 'last': '' }, { 'last': 'required_with:first' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': '' }, { 'last': 'required_with:first' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({  }, { 'last': 'required_with:first' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'Nikita', 'last': 'Stenin' }, { 'last': 'required_with:first' }, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required with all', () => {
    expect.assertions(2)

    new Validator({ 'first': 'foo' }, { 'last': 'required_with_all:first,foo' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'foo' }, { 'last': 'required_with_all:first' }, locale).passes().then(result => expect(result).toBe(false))
})

test('validate required without', () => {
    expect.assertions(6)

    new Validator({ 'first': 'Nikita' }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'Nikita', 'last': '' }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': '' }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': 'Nikita', 'last': 'Stenin' }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'last': 'Stenin' }, { 'last': 'required_without:first' }, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required without multiple', () => {
    expect.assertions(6)

    const rules = {
        'f1': 'required_without:f2,f3',
        'f2': 'required_without:f1,f3',
        'f3': 'required_without:f1,f2',
    }

    new Validator({ }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo' }, rules, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'f2': 'foo' }, rules, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'f1': 'foo', 'f2': 'bar' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f2': 'foo', 'f3': 'bar' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo', 'f2': 'bar', 'f3': 'baz' }, rules, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required without all', () => {
    expect.assertions(8)

    const rules = {
        'f1': 'required_without_all:f2,f3',
        'f2': 'required_without_all:f1,f3',
        'f3': 'required_without_all:f1,f2',
    }

    new Validator({ }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f2': 'foo' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f3': 'foo' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo', 'f2': 'bar' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo', 'f3': 'bar' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f2': 'foo', 'f3': 'bar' }, rules, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'f1': 'foo', 'f2': 'bar', 'f3': 'baz' }, rules, locale).passes().then(result => expect(result).toBe(true))
})

test('validate required if', () => {
    expect.assertions(7)

    new Validator({ 'first': 'nikita' }, { 'last': 'required_if:first,nikita' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': 'nikita', 'last': 'stenin' }, { 'last': 'required_if:first,nikita' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'nikita', 'last': 'stenin' }, { 'last': 'required_if:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'ivan', 'last': 'ivanov' }, { 'last': 'required_if:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'foo': true }, { 'bar': 'required_if:foo,false' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'foo': true }, { 'bar': 'required_if:foo,true' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': 'ivan', 'last': '' }, { 'last': 'required_if:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(false))
})

test('validate required unless', () => {
    expect.assertions(6)

    new Validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,ivan' }, locale).passes().then(result => expect(result).toBe(false))
    new Validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,nikita' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'ivan', 'last': 'ivanov' }, { 'last': 'required_unless:first,nikita' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'nikita' }, { 'last': 'required_unless:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'ivan' }, { 'last': 'required_unless:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(true))
    new Validator({ 'first': 'pavel', 'last': '' }, { 'last': 'required_unless:first,nikita,ivan' }, locale).passes().then(result => expect(result).toBe(false))
})