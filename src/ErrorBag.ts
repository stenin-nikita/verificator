import { addError, removeError, clearErrors } from './actions'
import { Store } from 'redux'
import { IState } from './types'

export default class ErrorBag {
    protected _store: Store<IState>

    constructor(store: Store<IState>) {
        this._store = store
    }

    public add(key: string, message: string): this {
        this._store.dispatch(addError(key, message))

        return this
    }

    public remove(key: string): this {
        this._store.dispatch(removeError(key))

        return this
    }

    public clear(): this {
        this._store.dispatch(clearErrors())

        return this
    }

    public first(key: string): string {
        const [ messages ] = this.get(key)

        return messages
    }

    public has(key: string): boolean {
        return this.get(key).length > 0
    }

    public get(key: string): string[] {
        const { errors } = this._store.getState()

        if (key in errors) {
            return errors[key]
        }

        return []
    }

    public all(): string[] {
        const { errors } = this._store.getState()

        return Object.keys(errors).reduce<string[]>((value, key) => {
            return value.concat(this.get(key))
        }, [])
    }

    public any(): boolean {
        return this.count() > 0
    }

    public count(): number {
        const { errors } = this._store.getState()

        return Object.keys(errors).reduce((value, key) => {
            return value + errors[key].length
        }, 0)
    }
}
