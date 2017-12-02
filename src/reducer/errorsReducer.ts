import { Reducer } from 'redux'
import { ErrorsState } from '../types'
import { ADD_ERROR, REMOVE_ERROR, CLEAR_ERRORS } from '../constants/types'

const initialState: ErrorsState = {}

const reducer: Reducer<ErrorsState> = (state = initialState, action) => {
    const { type } = action

    if (type === ADD_ERROR) {
        const { key, message } = action.payload
        const errors = state[key] || []

        if (errors.indexOf(message) === -1) {
            return { ...state, [key]: [...errors, message] }
        }
    } else if (type === REMOVE_ERROR) {
        const { key } = action.payload
        if (key in state) {
            return { ...state, [key]: [] }
        }
    } else if (type === CLEAR_ERRORS) {
        return {}
    }

    return state
}

export default reducer
