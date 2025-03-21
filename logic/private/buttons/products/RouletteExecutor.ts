import {BasePrivateButtonExecutor} from "../../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../../core/types/Some";
import {ProductRouting} from "../../../../core/annotations/routing/ProductRouting";
import {Moderator} from "../../../../core/classes/impl/entity/Moderator";
import {MagazineProducts} from "../../../../core/classes/impl/enums/MagazineProducts";
import {ModeratorType} from "../../../../core/classes/impl/enums/ModeratorType";
import {System} from "../../../../core/namespaces/System";
import delay = System.delay;
import {Messages} from "../../../../core/namespaces/Messages";
import {Session} from "../../../../core/namespaces/Session";

@ProductRouting('roulette')
export class RouletteExecutor extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        await message.editMessage({message: `🔦 Взламываем кейс... (3)`})
        await delay(1000);
        await message.editMessage({message: `🔨 Взламываем кейс... (2)`})
        await delay(1000)
        await message.editMessage({message: `⛓️‍💥 Взламываем кейс... (1)`})
        await delay(1000)
        const products : Set<MagazineProducts> = new Set(MagazineProducts.getAllProducts(sender.moderatorType));
        products.delete(MagazineProducts.ROULETTE);

        const weightedItems: MagazineProducts[] = [];

        products.forEach((product) => {
            let weight = 1;

            if (product === MagazineProducts.HOLIDAY) weight = 50;
            if (product === MagazineProducts.CHANGE_NAME_AND_BANNER_IN_FA) weight = 30;
            if (product === MagazineProducts.REVOCATION_PUNISHMENTS) weight = 10;
            if (product === MagazineProducts.SIGNATURE_FROM_DMM) weight = 0.5;

            for (let i = 0; i < weight; i++) {
                weightedItems.push(product);
            }
        });

        const prize: MagazineProducts = weightedItems[Math.floor(Math.random() * weightedItems.length)];
        const cost : number = prize[sender.moderatorType === ModeratorType.BASIC ? 'costBasic' : 'costPanel'];
        if (prize === MagazineProducts.CHANGE_NAME_AND_BANNER_IN_FA) Session.CHANGE_FORUM_STATS.set(sender.userId, 'приз')
        else {
            const head : Moderator[] = await sender.getHead();
            for (const i of head) {
                await i.send(`✡️ Модератор ${sender.getOnlyMention(sender.nick)} выиграл ${prize.displayName} в рулетке!`)
            }
        }
        await message.editMessage({message: `🎁 Вам выпало - ${prize.displayName} ценой в ${cost} баллов!${prize === MagazineProducts.CHANGE_NAME_AND_BANNER_IN_FA ? ` Укажите, что вы хотите изменить и на что. Ваше сообщение будет отправлено отделу администрации. НЕ ПРИКРЕПЛЯЙТЕ КАРТИНКИ, используйте хостинги!` : ''}`}, Messages.TO_STATISTIC(sender.userId))
    }

}