const flattenData = (data: any): { [key: string]: any } => {
	var result = {}
	
	for (var i in data) {
		if (!data.hasOwnProperty(i)) continue
		
		if ((typeof data[i]) == 'object') {
            var flatData = flattenData(data[i])
    
			for (var x in flatData) {
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