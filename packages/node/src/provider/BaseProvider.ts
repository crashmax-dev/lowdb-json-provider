import type { Steno } from '../types.js'

export class BaseProvider<T> {
  #adapter: Steno.NodeAdapter<T>

  constructor(adapter: Steno.NodeAdapter<T>) {
    this.#adapter = adapter
  }

  get data(): T | null {
    return this.#adapter.data
  }

  set data(data: T | null) {
    this.#adapter.data = data
  }

  get initialData(): T | null {
    return this.#adapter.initialData
  }

  set initialData(data: T | undefined | null) {
    if (!data) return
    this.#adapter.initialData = this.#adapter.plainData(data)
  }
}
