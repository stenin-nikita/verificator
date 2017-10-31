import requireParameterCount from '../../src/helpers/requireParameterCount'

test('requireParameterCount throw', () => {
    expect(() => {
        requireParameterCount(1, [], 'test')
    }).toThrow()
    expect(() => {
        requireParameterCount(2, [1], 'test')
    }).toThrow()
    expect(() => {
        requireParameterCount(1, [1], 'test')
    }).not.toThrow()
    expect(() => {
        requireParameterCount(3, [1,2,3], 'test')
    }).not.toThrow()
})