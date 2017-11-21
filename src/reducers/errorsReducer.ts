import { AnyAction } from 'redux'
import { ActionTypes } from '../constants'
import { Collection } from '../types'

const initialState: Collection<string[]> = {}

export default function reducer(state: Collection<string[]> = initialState, action: AnyAction): Collection<string[]> {
    const { type } = action

    if (type === ActionTypes.ADD_ERROR) {
        const { key, message } = action.payload
        const errors = state[key] || []

        if (errors.indexOf(message) === -1) {
            return { ...state, [key]: [...errors, message] }
        }
    } else if (type === ActionTypes.REMOVE_ERROR) {
        const { key } = action.payload
        if (key in state) {
            return { ...state, [key]: [] }
        }
    } else if (type === ActionTypes.CLEAR_ERRORS) {
        return {}
    }

    return state
}
