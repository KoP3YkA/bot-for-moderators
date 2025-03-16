export class NameCase {
    /**
     * Именительный: стол
     */
    public static NOM: NameCase = new NameCase('Nom', 'Консоль');

    /**
     * Родительный: нет стола
     */
    public static GEN: NameCase = new NameCase('Gen', 'Консоли');

    /**
     * Дательный: дать столу
     */
    public static DAT: NameCase = new NameCase('Dat', 'Консоли');

    /**
     * Винительный: винить стол
     */
    public static ACC: NameCase = new NameCase('Acc', 'Консоль');

    /**
     * Творительный: творить столом
     */
    public static INS: NameCase = new NameCase('Ins', 'Консолью');

    /**
     * Предложный: о столе
     */
    public static ABL: NameCase = new NameCase('Abl', 'Консоли');

    // --------------------------------------------------

    public constructor(
        public tag : string,
        public console : string
    ) {}

}