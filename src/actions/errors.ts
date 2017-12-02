import { ADD_ERROR, REMOVE_ERROR, CLEAR_ERRORS } from '../constants/types'

export const addError = (key: string, message: string) => ({
    type: ADD_ERROR,
    payload: { key, message },
})

export const removeError = (key: string) => ({
    type: REMOVE_ERROR,
    payload: { key },
})

export const clearErrors = () => ({
    type: CLEAR_ERRORS,
})
