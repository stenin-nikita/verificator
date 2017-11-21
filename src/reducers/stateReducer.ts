import { AnyAction } from 'redux'
import { ActionTypes } from '../constants'

const initialState: boolean = false

export default function reducer(state: boolean = initialState, action: AnyAction): boolean {
    const { type } = action

    if (type === ActionTypes.START_VALIDATE) {
        return true
    } else if (type === ActionTypes.STOP_VALIDATE) {
        return false
    }

    return state
}
