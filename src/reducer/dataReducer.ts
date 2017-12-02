import { Reducer } from 'redux'
import { DataState } from '../types'
import { SET_DATA } from '../constants/types'

const initialState: DataState = {}

const reducer: Reducer<DataState> = (state = initialState, action) => {
    const { type } = action

        if (type === SET_DATA) {
            const { data } = action.payload

            return { ...data }
        }

        return state
}

export default reducer
