const flattenData = (data: any): { [key: string]: any } => {
    let result: any = {}

    for (let i in data) {
        if (!data.hasOwnProperty(i)) {
            continue
        }

        if (typeof data[i] === 'object') {
            let flatData = flattenData(data[i])

            for (let x in flatData) {
                if (!flatData.hasOwnProperty(x)) {
                    continue
                }

                result[i + '.' + x] = flatData[x]
            }
        } else {
            result[i] = data[i]
        }
    }

    return result
}

export default flattenData
