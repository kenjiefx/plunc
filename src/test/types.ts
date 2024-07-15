export type PlaceholderScope = {
  a: 'a',
  b: { a: 'a' }
  c: 2,
  d: 4,
  e: {
    a: 4,
    b: {
      a: 3
    }
  },
  f:()=>'a',
  g: {
    a:()=>'a',
    b:(arg:number) => number,
    c: {
      a:(arg1: string, arg2: string)=>string
    }
  }
}


export type Repeats = {
  a: [{a:'a'},{a:'b'},{a:'c'}],
  b: 4
}