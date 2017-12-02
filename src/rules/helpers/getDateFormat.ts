const getDateFormat = (attribute: string, validator: any): string|null => {
    let rule = validator.getRule(attribute, 'date_format')

    if (rule) {
        const { parameters: [ format ] } = rule

        return typeof format === 'string' && format ? format : null
    }

    return null
}

export default getDateFormat