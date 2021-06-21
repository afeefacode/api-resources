export function enumerable(isEnumarable) {
    return (target, key) => {
        // https://github.com/endel/nonenumerable/blob/master/src/index.ts
        Object.defineProperty(target, key, {
            get: () => undefined,
            set(value) {
                if (this.value === undefined) {
                    Object.defineProperty(this, key, {
                        value,
                        writable: true,
                        enumerable: isEnumarable,
                        configurable: true
                    });
                }
                else {
                    this.value = value;
                }
            },
            enumerable: isEnumarable
        });
    };
}
