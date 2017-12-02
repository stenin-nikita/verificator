import { Reducer } from 'redux'
import { InitialRulesState } from '../types'
import { SET_RULES } from '../constants/types'

const initialState: InitialRulesState = {}

const reducer: Reducer<InitialRulesState> = (state = initialState, action) => {
    const { type } = action

    if (type === SET_RULES) {
        const { initialRules } = action.payload

        return { ...initialRules }
    }

    return state
}

export default reducer
