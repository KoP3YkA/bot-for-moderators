import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {RoutingMaps} from "../../../core/namespaces/RoutingMaps";
import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {MagazineProducts} from "../../../core/classes/impl/enums/MagazineProducts";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";

@PrivateButtonRouting('magazineProduct')
export class MagazineProductButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const productTag : string = message.getField<string>('product');
        const sender : Moderator = message.sender;
        await sender.init();
        const product : MagazineProducts | null = MagazineProducts.findByTag(productTag);
        if (!product) return await message.snackbar(`Такой товар не найден!`)

        if (sender.points < product[sender.moderatorType === ModeratorType.BASIC ? 'costBasic' : 'costPanel']) return await message.reply(`У вас недостаточно баллов для покупки!`)

        if (RoutingMaps.PRODUCTS_EXECUTORS.has(productTag)) {
            const executor : any = RoutingMaps.PRODUCTS_EXECUTORS.get(productTag) as unknown as any;
            const _class = new (executor as { new(): BaseExecutor })()
            await sender.getStatisticService().points(sender.points - product[sender.moderatorType === ModeratorType.BASIC ? 'costBasic' : 'costPanel'])
            await _class.execute(message);
        } else {
            await message.snackbar(`Что-то пошло не так! Не удалось найти executor для этого товара!`)
        }
    }

}