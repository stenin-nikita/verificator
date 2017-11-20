import { ActionTypes } from '../constants'

export const addError = (key: string, message: string) => ({
    type: ActionTypes.ADD_ERROR,
    payload: { key, message },
})

export const removeError = (key: string) => ({
    type: ActionTypes.REMOVE_ERROR,
    payload: { key },
})

export const clearErrors = () => ({
    type: ActionTypes.CLEAR_ERRORS,
    payload: {},
})
