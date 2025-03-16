export class ModeratorType {

    public static BASIC : ModeratorType = new ModeratorType('basic', 'Основной состав')
    public static PANEL : ModeratorType = new ModeratorType('panel', 'Состав МБИ')

    // ---------------------------------

    public constructor(
        public tag : string,
        public displayName : string,
    ) {}

    public static findByTag(tag: string) : ModeratorType | null {
        return Object.values(this)
            .filter(obj => obj instanceof ModeratorType)
            .find(obj => obj.tag == tag) ?? null
    }

}