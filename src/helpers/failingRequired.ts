import required from '../rules/required'

const anyFailingRequired = (attributes: string[], validator: any): boolean => {
    for (let key of attributes) {
        if (! required(key, validator.getValue(key), [], validator)) {
            return true
        }
    }

    return false
}

const allFailingRequired = (attributes: string[], validator: any): boolean => {
    for (let key of attributes) {
        if (required(key, validator.getValue(key), [], validator)) {
            return false
        }
    }

    return true
}

export {
    anyFailingRequired,
    allFailingRequired,
}
