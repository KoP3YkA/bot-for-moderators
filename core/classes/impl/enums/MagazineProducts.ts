import {ModeratorType} from "./ModeratorType";

export class MagazineProducts {
    // info: если cost < 0, то для этого направления товар недоступен

    /**
     * Роспись от ЗРМ
     */
    public static SIGNATURE_FROM_DMM : MagazineProducts = new MagazineProducts('zrm_signature', 'Роспись от ЗРМ на форуме', 100, 300);

    public static HOLIDAY : MagazineProducts = new MagazineProducts('holiday', 'Отгул', 20, 100);

    public static REVOCATION_PUNISHMENTS : MagazineProducts = new MagazineProducts('punishment_revocation', 'Снятие всех наказаний', 150, 400);

    public static CHANGE_NAME_AND_BANNER_IN_FA : MagazineProducts = new MagazineProducts('fa_stats', 'Изменение имени&баннера на ФА', 50, 200);

    public static ROULETTE : MagazineProducts = new MagazineProducts('roulette', 'Рулетка', (100+20+150+50) / 4, (300+100+400+200) / 4)

    // ---------------------------------------------------

    public constructor(
        public tag : string,
        public displayName : string,
        public costBasic : number,
        public costPanel : number,
    ) {}

    public static findByTag(tag: string) : MagazineProducts | null {
        return Object.values(this)
            .filter(obj => obj instanceof MagazineProducts)
            .find(obj => obj.tag == tag) ?? null;
    }

    public static getAllProducts(division: ModeratorType) : MagazineProducts[] {
        return Object.values(this)
            .filter(obj => obj instanceof MagazineProducts)
            .filter(obj => obj[division === ModeratorType.BASIC ? 'costBasic' : 'costPanel'] > 0)
    }

}