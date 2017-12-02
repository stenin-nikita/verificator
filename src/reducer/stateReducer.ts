import { Reducer } from 'redux'
import { ValidatingState } from '../types'
import { START_VALIDATE, STOP_VALIDATE } from '../constants/types'

const initialState: ValidatingState = {}

const reducer: Reducer<ValidatingState> = (state = initialState, action) => {
    const { type } = action

    if (type === START_VALIDATE) {
        const attribute = action.payload.attribute

        return {
            ...state,
            [attribute]: true,
        }
    } else if (type === STOP_VALIDATE) {
        const attribute = action.payload.attribute

        return {
            ...state,
            [attribute]: false,
        }
    }

    return state
}

export default reducer
