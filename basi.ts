type Boh<T> = T extends any ? { prop: T } : never
// Boh<1 | 2> => Boh<1> | Boh<2>

type test = Boh<1 | 2> // NON OTTENGO { prop: 1 | 2 }
//    ^?

type MappedType1<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
}

type test2 = MappedType1<{ readonly a: 2, b?: 6 }>
//    ^?

type test3 = Boh<[1 | 2, 'a' | 'b']>
//    ^?

type Boh2<T> = { [K in keyof T]: 17 }

type test4 = Boh2<["ciao", boolean ]>