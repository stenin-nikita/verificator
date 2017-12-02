import ErrorBag from '../src/ErrorBag'
import reducer from '../src/reducer'
import { createStore } from 'redux'

function createErrorBag() {
    return new ErrorBag(createStore(reducer));
}

test('test ErrorBag is empty', () => {
    const errors = createErrorBag()

    expect(errors.count()).toBe(0)
    expect(errors.any()).toBe(false)
    expect(errors.all()).toEqual([])
    expect(errors.get('foo')).toEqual([])
    expect(errors.has('foo')).toBe(false)
    expect(errors.first('foo')).toBe(undefined)
})

test('test ErrorBag is not empty', () => {
    const errors = createErrorBag()

    errors.add('foo', 'message')
    expect(errors.count()).toBe(1)
    expect(errors.any()).toBe(true)
    expect(errors.all()).toEqual(['message'])
    expect(errors.get('foo')).toEqual(['message'])
    expect(errors.has('foo')).toBe(true)
    expect(errors.first('foo')).toBe('message')

    errors.add('foo', 'message')
    expect(errors.count()).toBe(1)
    expect(errors.all()).toEqual(['message'])
    expect(errors.get('foo')).toEqual(['message'])

    errors.add('bar', 'message')
    expect(errors.count()).toBe(2)
    expect(errors.any()).toBe(true)
    expect(errors.all()).toEqual(['message', 'message'])
    expect(errors.get('bar')).toEqual(['message'])
    expect(errors.has('bar')).toBe(true)
    expect(errors.first('bar')).toBe('message')

    errors.remove('foo')
    expect(errors.count()).toBe(1)
    expect(errors.any()).toBe(true)
    expect(errors.all()).toEqual(['message'])
    expect(errors.get('foo')).toEqual([])
    expect(errors.has('foo')).toBe(false)
    expect(errors.first('foo')).toBe(undefined)

    errors.clear()
    expect(errors.count()).toBe(0)
    expect(errors.any()).toBe(false)
    expect(errors.all()).toEqual([])
    expect(errors.get('bar')).toEqual([])
    expect(errors.has('bar')).toBe(false)
    expect(errors.first('bar')).toBe(undefined)
})