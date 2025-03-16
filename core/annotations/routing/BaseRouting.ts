export function BaseRouting(map: Map<any, any>, value: any) {
    return function (target: any) {
        map.set(value, target)
    }
}