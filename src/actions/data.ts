import { ActionTypes } from '../constants'
import { Collection } from '../types'

export const updateData = (data: Collection<any>) => ({
    type: ActionTypes.UPDATE_DATA,
    payload: { data },
})
