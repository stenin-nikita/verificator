const failsRatioCheck = (parameters: { [key:string]:string }, width: number, height: number): boolean => {
    if (!('ratio' in parameters)) {
        return false
    }

    const params = parameters.ratio.split('/').filter(Boolean)
    let [ numerator, denominator ]: string[]|number[] = params

    numerator = parseFloat(numerator) || 1
    denominator = parseInt(denominator) || 1

    const precision = 1 / Math.max(width, height)

    return Math.abs(numerator / denominator - width / height) > precision
}

export default failsRatioCheck