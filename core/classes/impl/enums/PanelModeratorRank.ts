export class PanelModeratorRank {

    // Default
    public static DEFAULT : PanelModeratorRank = new PanelModeratorRank('default', 'Пользователь', 0);

    // Moderators
    public static MIDDLE_MODERATOR : PanelModeratorRank = new PanelModeratorRank('moderator', 'Модератор', 100);
    public static SENIOR_MODERATOR : PanelModeratorRank = new PanelModeratorRank('sr.moderator', 'Старший Модератор', 100);

    // ----------------------------------------------

    protected constructor(
       public tag : string,
       public displayName : string,
       public weight : number
    ) {}

    public static findByTag(tag: string) : PanelModeratorRank {
        return Object.values(this)
            .filter(obj => obj instanceof PanelModeratorRank)
            .find(obj => obj.tag == tag) ?? PanelModeratorRank.DEFAULT
    }

}