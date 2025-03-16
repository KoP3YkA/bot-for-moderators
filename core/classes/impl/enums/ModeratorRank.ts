export class ModeratorRank {

    // Users
    public static DEFAULT : ModeratorRank = new ModeratorRank('default', 'Пользователь', 0)

    // Default moderators
    public static JUNIOR_MODERATOR : ModeratorRank = new ModeratorRank('jr.moderator', 'Младший Модератор', 100)
    public static MIDDLE_MODERATOR : ModeratorRank = new ModeratorRank('moderator', 'Модератор', 100)
    public static SENIOR_MODERATOR : ModeratorRank = new ModeratorRank('sr.moderator', 'Старший Модератор', 100)

    // Staff
    public static CURATOR : ModeratorRank = new ModeratorRank('curator', 'Куратор Модерации', 200);
    public static DEPUTY : ModeratorRank = new ModeratorRank('deputy', 'Зам. Главного Модератора', 300);
    public static CHIEF : ModeratorRank = new ModeratorRank('chief', 'Главный Модератор', 1000)

    // --------------------------------------

    private constructor(
        public tag : string,
        public displayName : string,
        public weight : number
    ) {}

    public static findByTag(tag: string) : ModeratorRank {
        return Object.values(this)
            .filter(obj => obj instanceof ModeratorRank)
            .find(obj => obj.tag == tag) ?? ModeratorRank.DEFAULT
    }

}