export function enumerable (isEnumarable: boolean): any {
  return (target: any, key: string) => {
    // https://github.com/endel/nonenumerable/blob/master/src/index.ts
    Object.defineProperty(target, key, {
      get: () => undefined,
      set (this: PropertyDescriptor, value: unknown) {
        if (this.value === undefined) {
          Object.defineProperty(this, key, {
            value,
            writable: true,
            enumerable: isEnumarable,
            configurable: true
          })
        } else {
          this.value = value
        }
      },
      enumerable: isEnumarable
    })
  }
}
