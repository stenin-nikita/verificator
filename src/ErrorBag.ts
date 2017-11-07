export default class ErrorBag {
    private _messages: { [key: string]: string[] } = {}

    add(key: string, message: string) {
        this._messages[key] = this._messages[key] || []

        if (this._messages[key].indexOf(message) === -1) {
            this._messages[key].push(message)
        }

        return this
    }

    first(key: string): string {
        const [ messages ] = this.get(key)
    
        return messages
    }

    has(key: string): boolean {
        return this.get(key).length > 0
    }

    get(key: string): string[] {
        if (key in this._messages) {
            return this._messages[key]
        }

        return []
    }

    all(): string[] {
        return Object.keys(this._messages).reduce<string[]>((value, key) => {
            return value.concat(this.get(key))
        }, [])
    }

    any(): boolean {
        return this.count() > 0
    }

    count(): number {
        return Object.keys(this._messages).reduce((value, key) => {
            return value + this._messages[key].length
        }, 0)
    }
}
