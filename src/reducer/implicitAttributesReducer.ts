import { Reducer } from 'redux'
import { ImplicitAttributesState } from '../types'
import { SET_RULES } from '../constants/types'

const initialState: ImplicitAttributesState = {}

const reducer: Reducer<ImplicitAttributesState> = (state = initialState, action) => {
    const { type } = action

    if (type === SET_RULES) {
        const { implicitAttributes } = action.payload

        return { ...implicitAttributes }
    }

    return state
}

export default reducer
