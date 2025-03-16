export class Environ {

    public static getEnvironByField<T extends any>(field: string) : T {
        return process.env[field] as T;
    }

    public static getEnvironBoolean(field: string) : boolean {
        return !!+(process.env[field] as string);
    }

}