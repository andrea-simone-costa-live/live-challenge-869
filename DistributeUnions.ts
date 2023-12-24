import { LooseLookup, MergeInsertions, UnionToIntersection } from "./utils";

type T1 = DistributeUnions<[1 | 2, 'a' | 'b']>
// =>   [1, 'a'] | [2, 'a'] | [1, 'b'] | [2, 'b']

type T2 = DistributeUnions<{ type: 'a', value: number | string } | { type: 'b', value: boolean }>
//  =>  | { type 'a', value: number }
//      | { type 'a', value: string }
//      | { type 'b', value: boolean }

type T3 = DistributeUnions<[{ value: 'a' | 'b' }, { x: { y: 2 | 3 } }] | 17>
//  =>  | [{ value: 'a' },  { x: { y: 2  } }]
//      | [{ value: 'a' },  { x: { y: 3  } }]
//      | [{ value: 'b' },  { x: { y: 2  } }]
//      | [{ value: 'b' },  { x: { y: 3  } }]
//      | 17

type _DistributeUnions<T> = {
  [K in keyof T]: {
    PROP: T[K] extends infer U //  U = T[K]
      ? U extends any
        ? { [KK in K]: U }
        : never
    : never;
  }
}

type test = UnionToIntersection<_DistributeUnions<[1 | 2, 'a' | 'b']>[number]>

type DistributeUnions<
  T,
  DT = { [K in keyof T]: DistributeUnions<T[K]> }
  > = DT extends object
    ? MergeInsertions<
        LooseLookup<
          UnionToIntersection<
            LooseLookup<
              _DistributeUnions<DT>,
              DT extends readonly any[] ? number : keyof DT
            >
          >,
          "PROP"
        >
      > extends infer RES
        ? RES extends any
          ? DT extends readonly any[]
            ? { [K in keyof DT]: LooseLookup<RES, K> /* RES[K] */ }
            : RES
          : never
        : never
    : DT;

// Proprietà fondamentale 1: (A | B) & C = (A & C) | (B & C)
// Proprietà fondamentale 2: { prop: T } & { prop: U } = { prop: T & U }
// Proprietà fondamentale 3: ({ a: T, b: U })["a" | "b"] = T | U

// DistributeUnions<{ a: 1 | 2, b: 3 }>
// -- def
// UnionToIntersection<({ a: { PROP: { a: 1 } | { a : 2 } }, b: { PROP: { b: 3 } } })["a" | "b"]>["PROP"]
// -- prop 3
// UnionToIntersection<({ PROP: { a: 1 } | { a : 2 } }) | ({ PROP: { b: 3 } })>["PROP"]
// -- prop 2
// ({ PROP: ({ a: 1 } | { a : 2 }) & ({ b: 3 }) })["PROP"]
// -- prop 1
// ({ PROP: ({ a: 1, b : 3 } | { a : 2, b: 3 }) })["PROP"]
// -- lookup
// ({ a: 1, b : 3 } | { a : 2, b: 3 })
