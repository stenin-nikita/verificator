const parseTime = (value: any, date: Date = new Date()): Date|any => {
    if(typeof value === 'string' && /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)) {
        let y = String(date.getFullYear())
        let m = String(date.getMonth() + 1)
        let d = String(date.getDate())

        m = Number(m) < 10 ? `0${m}` : `${m}`
        d = Number(d) < 10 ? `0${d}` : `${d}`

        return new Date(`${y}-${m}-${d}T${value}`)
    }

    return value
}

export default parseTime