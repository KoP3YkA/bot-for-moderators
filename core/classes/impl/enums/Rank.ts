export class Rank {

    // Default
    public static DEFAULT : Rank = new Rank('default', 'Пользователь', 0);

    // Moders
    public static JUNIOR_MODERATOR : Rank = new Rank('jr.moderator', 'Младший Модератор', 100);
    public static SENIOR_MODERATOR : Rank = new Rank('sr.moderator', 'Старший Модератор', 200);

    // Admins
    public static JUNIOR_ADMINISTRATOR : Rank = new Rank('jr.administrator', 'Младший Администратор', 300);
    public static MIDDLE_ADMINISTRATOR : Rank = new Rank('administrator', 'Администратор', 400);

    public static CHIEF_ADMINISTRATOR : Rank = new Rank('chief.admin', 'Главный Администратор', 1000);

    // ------------------------------------

    protected constructor(
        public tag : string,
        public displayName : string,
        public weight : number
    ) {}

    public static findByTag(tag: string) : Rank {
        return Object.values(this)
            .filter(obj => obj instanceof Rank)
            .find(obj => obj.tag == tag) ?? Rank.DEFAULT
    }

}