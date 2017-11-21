const prefix = '@@verificator'

const ADD_ERROR = `${prefix}/ADD_ERROR`
const REMOVE_ERROR = `${prefix}/REMOVE_ERROR`
const CLEAR_ERRORS = `${prefix}/CLEAR_ERRORS`

const UPDATE_DATA = `${prefix}/UPDATE_DATA`

const START_VALIDATE = `${prefix}/START_VALIDATE`
const STOP_VALIDATE = `${prefix}/STOP_VALIDATE`

const ActionTypes = {
    ADD_ERROR,
    REMOVE_ERROR,
    CLEAR_ERRORS,
    UPDATE_DATA,
    START_VALIDATE,
    STOP_VALIDATE,
}

export default ActionTypes
