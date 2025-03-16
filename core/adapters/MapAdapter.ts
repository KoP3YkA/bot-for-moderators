export class MapAdapter {

    public constructor(
       public map : Map<any, any>
    ) {}

    public getKey<T>(searchValue: any) : T | null {
        for (let [key, value] of this.map.entries()) {
            if (value === searchValue)
                return key;
        }
        return null;
    }

}