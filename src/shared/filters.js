export const filterByObjKey = (value, args) => {
    if (args.length === 0) { return value }
    if (args.length > 0) {
        return value.filter(
            obj => {
                for (let i = 0; i < args.length; i++) {
                    const arr = Object.values(obj)
                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j] === args[i]) return obj
                    }
                }
            }
        )
    }
}
export const filterByMinMax = (value, min, max) => {
    if (!min && !max) { return value; }
    if (!max) { return value.filter(item => item.price >= min) }
    if (!min) { return value.filter(item => item.price <= max) }
    return value.filter(item => (item.price >= min && item.price <= max))
}