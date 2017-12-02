import { START_VALIDATE, STOP_VALIDATE } from '../constants/types'

export const startValidate = (attribute: string) => ({
    type: START_VALIDATE,
    payload: { attribute },
})

export const stopValidate = (attribute: string) => ({
    type: STOP_VALIDATE,
    payload: { attribute },
})
