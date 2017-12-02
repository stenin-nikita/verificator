import { combineReducers, Reducer } from 'redux'
import dataReducer from './dataReducer'
import errorsReducer from './errorsReducer'
import implicitAttributesReducer from './implicitAttributesReducer'
import initialRulesReducer from './initialRulesReducer'
import rulesReducer from './rulesReducer'
import stateReducer from './stateReducer'
import { IState } from '../types'

const rootReducer: Reducer<IState> = combineReducers({
    data: dataReducer,
    errors: errorsReducer,
    implicitAttributes: implicitAttributesReducer,
    initialRules: initialRulesReducer,
    rules: rulesReducer,
    validating: stateReducer,
})

export default rootReducer
