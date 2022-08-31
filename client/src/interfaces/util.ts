type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Required<T, K>

type _Explode<T, O extends string> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? Explode<T[K]> extends infer E
          ? E extends { key: string; value: string, optional: string }
            ? {
                key: `${K}${E['key'] extends typeof String ? O : ''} ${E['key']}`
                value: E extends any[] ? E['value'][] : E['value']
                optional: E['key'] extends ''
                  ? {} extends Pick<T, K>
                    ? true
                    : false
                  : E['optional']
              }
            : never
          : never
        : never
    }[keyof T]
  : { key: ''; value: T; optional: false }

type Explode<T, O extends string = '.'> = _Explode<
  T extends readonly any[] ? { '': T[number] } : T,
  O
>


type Collapse<T> = {
  [E in Extract<T, { optional: false, key: string, value: string }> as E['key']]: E['value']
} &
  Partial<
    { [E in Extract<T, { optional: true, key: string, value: string  }> as E['key']]: E['value'] }
  > extends infer O
  ? { [K in keyof O]: O[K] }
  : never

export type DeepFlatten<T, O extends string = '.'> = Collapse<Explode<T, O>>
