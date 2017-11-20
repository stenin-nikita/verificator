import { combineReducers, AnyAction } from 'redux'
import errorsReducer from './errorsReducer'
import dataReducer from './dataReducer'

const rootReducer = combineReducers<AnyAction>({
    errors: errorsReducer,
    data: dataReducer,
})

export default rootReducer
