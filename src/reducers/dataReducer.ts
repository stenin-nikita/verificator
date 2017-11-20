import { AnyAction } from 'redux'
import { ActionTypes } from '../constants'
import { Collection } from '../types'

const initialState: Collection<any> = {}

export default function reducer(state: Collection<any> = initialState, action: AnyAction): Collection<any> {
    const { type } = action

    if (type === ActionTypes.UPDATE_DATA) {
        const { data } = action.payload as { data: Collection<any> }

        return { ...data }
    }

    return state
}
