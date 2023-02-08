export type Data<T> = T | string | null

export type DataTransformer<T> = {
  toJSON: (data: Data<T>) => T | null
  toString: (data: Data<T>) => string
}

export type EntityTransformer<T> = (data: Data<T>) => T | null
