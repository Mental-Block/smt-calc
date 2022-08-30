type _Explode<T, O = '.'> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? Explode<T[K]> extends infer E
          ? E extends Entry
            ? {
                key: `${K}${E['key'] extends '' ? '' : O}${E['key']}`
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

type Explode<T, O = '.'> = _Explode<
  T extends readonly any[] ? { '': T[number] } : T,
  O
>

type Collapse<T extends Entry> = {
  [E in Extract<T, { optional: false }> as E['key']]: E['value']
} &
  Partial<
    { [E in Extract<T, { optional: true }> as E['key']]: E['value'] }
  > extends infer O
  ? { [K in keyof O]: O[K] }
  : never

export type DeepFlatten<T, O = '.'> = Collapse<Explode<T, O>>
