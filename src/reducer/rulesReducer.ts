import { Reducer } from 'redux'
import { ParsedRulesState } from '../types'
import { SET_RULES } from '../constants/types'

const initialState: ParsedRulesState = {}

const reducer: Reducer<ParsedRulesState> = (state = initialState, action) => {
    const { type } = action

    if (type === SET_RULES) {
        const { rules } = action.payload

        return { ...rules }
    }

    return state
}

export default  reducer
