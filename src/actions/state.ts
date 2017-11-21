import { ActionTypes } from '../constants'

export const startValidate = () => ({
    type: ActionTypes.START_VALIDATE,
})

export const stopValidate = () => ({
    type: ActionTypes.STOP_VALIDATE,
})