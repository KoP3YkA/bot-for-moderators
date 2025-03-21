import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";
import {MagazineProducts} from "../../../core/classes/impl/enums/MagazineProducts";
import {PayloadButton} from "../../../core/interfaces/buttons/PayloadButton";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateButtonRouting('magazine')
export class MagazineButton extends BaseExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();

        const moderatorType : ModeratorType = sender.moderatorType;
        const products : MagazineProducts[] = MagazineProducts.getAllProducts(moderatorType);
        let stringProductsMass : string[] = [];
        let keyboard : PayloadButton[] = [];
        let count : number = 0;

        for (const i of products) {
            count++;
            stringProductsMass.push(`${count}) ${i.displayName} | ${moderatorType === ModeratorType.BASIC ? i.costBasic : i.costPanel} баллов`)
            if (products.length <= 6) {
                keyboard.push({
                    title: i.displayName,
                    color: Color.BLUE,
                    payload: {command: 'magazineProduct', product: i.tag},
                    newRow: count % 2 !== 0 && count !== 1
                })
            } else if (count <= 5) {
                keyboard.push({
                    title: i.displayName,
                    color: Color.BLUE,
                    payload: {command: 'magazineProduct', product: i.tag},
                    newRow: count % 2 !== 0 && count !== 1
                })
            } else {
                keyboard.push({
                    title: '⏩',
                    color: Color.WHITE,
                    payload: {command: 'magazineProductPlus', page: 1},
                })
            }
        }

        await message.editMessage({
            message: `Магазин\n\n${stringProductsMass.join('\n')}\n\nЧтобы купить что-то, используйте кнопку ниже.`
        }, ...keyboard)

    }

}