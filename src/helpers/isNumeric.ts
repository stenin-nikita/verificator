const isNumeric = (value: any): boolean => {
    const type = typeof value
    return (type === "number" || type === "string") && !isNaN(Number(value) - parseFloat(String(value)))
}

export default isNumeric