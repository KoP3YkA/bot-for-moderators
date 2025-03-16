export function ReverseRouting(map: Map<any, any>, value: any) {
    return function (target: any) {
        map.set(target, value)
    }
}