import { ErrorBagInterface } from './types'

export default class ErrorBag implements ErrorBagInterface {
    private _messages: { [key: string]: string[] } = {}

    public add(key: string, message: string): this {
        this._messages[key] = this._messages[key] || []

        if (this._messages[key].indexOf(message) === -1) {
            this._messages[key].push(message)
        }

        return this
    }

    public clear(key?: string): this {
        if (key != null && this.has(key)) {
            this._messages[key] = []
        } else {
            this._messages = {}
        }

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
        if (key in this._messages) {
            return this._messages[key]
        }

        return []
    }

    public all(): string[] {
        return Object.keys(this._messages).reduce<string[]>((value, key) => {
            return value.concat(this.get(key))
        }, [])
    }

    public any(): boolean {
        return this.count() > 0
    }

    public count(): number {
        return Object.keys(this._messages).reduce((value, key) => {
            return value + this._messages[key].length
        }, 0)
    }
}
