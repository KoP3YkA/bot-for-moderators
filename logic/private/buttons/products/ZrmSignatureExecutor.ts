import {BasePrivateButtonExecutor} from "../../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../../core/types/Some";
import {ProductRouting} from "../../../../core/annotations/routing/ProductRouting";
import {Moderator} from "../../../../core/classes/impl/entity/Moderator";
import {Messages} from "../../../../core/namespaces/Messages";

@ProductRouting('zrm_signature')
export class ZrmSignatureExecutor extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const head : Moderator[] = await sender.getHead();
        for (const i of head) {
            await i.send(`✡️ Модератор ${sender.getOnlyMention(sender.nick)} купил роспись от ЗРМ!`)
        }
        await message.editMessage({message: `✅ Вы купили роспись от ЗРМ! Главный Модератор скинет ваш Форумный Аккаунт куратору группы #2 и через какое-то время он распишеться у вас на форуме.`}, Messages.TO_STATISTIC(sender.userId))
    }

}