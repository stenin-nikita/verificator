import { Store, AnyAction } from 'redux'
import { ErrorBagInterface } from './types'
import { addError, removeError, clearErrors } from './actions'

const createErrorBag = (store: Store<AnyAction>): ErrorBagInterface => {
    const bag: ErrorBagInterface = {
        add(key: string, message: string): ErrorBagInterface {
            store.dispatch(addError(key, message))

            return bag
        },

        remove(key: string): ErrorBagInterface {
            store.dispatch(removeError(key))

            return bag
        },

        clear(): ErrorBagInterface {
            store.dispatch(clearErrors())

            return bag
        },

        first(key: string): string {
            const [ messages ] = bag.get(key)

            return messages
        },

        has(key: string): boolean {
            return bag.get(key).length > 0
        },

        get(key: string): string[] {
            const { errors } = store.getState()

            if (key in errors) {
                return errors[key]
            }

            return []
        },

        all(): string[] {
            const { errors } = store.getState()

            return Object.keys(errors).reduce<string[]>((value, key) => {
                return value.concat(bag.get(key))
            }, [])
        },

        any(): boolean {
            return bag.count() > 0
        },

        count(): number {
            const { errors } = store.getState()

            return Object.keys(errors).reduce((value, key) => {
                return value + errors[key].length
            }, 0)
        },
    }

    return bag
}

export default createErrorBag
