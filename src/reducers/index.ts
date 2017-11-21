import { combineReducers, AnyAction } from 'redux'
import errorsReducer from './errorsReducer'
import dataReducer from './dataReducer'
import stateReducer from './stateReducer'

const rootReducer = combineReducers<AnyAction>({
    errors: errorsReducer,
    data: dataReducer,
    validating: stateReducer,
})

export default rootReducer
