import { SET_DATA } from '../constants/types'
import isPlainObject from '../utils/isPlainObject'
import set from '../utils/set'
import { Items } from '../types'

const normalizeData = (data: any): any => {
    if (!isPlainObject(data) && !Array.isArray(data)) {
        return data
    }

    let newData: any

    if (Array.isArray(data)) {
        newData = data.map(normalizeData)
    } else {
        newData = {}

        Object.keys(data).forEach(key => {
            set(newData, key, normalizeData(data[key]))
        })
    }

    return newData
}

export const setData = (data: Items) => {
    return {
        type: SET_DATA,
        payload: { data: normalizeData(data) },
    }
}
