import {BasePrivateButtonExecutor} from "../../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../../core/types/Some";
import {ProductRouting} from "../../../../core/annotations/routing/ProductRouting";
import {Moderator} from "../../../../core/classes/impl/entity/Moderator";
import {Messages} from "../../../../core/namespaces/Messages";

@ProductRouting('punishment_revocation')
export class PunishmentRevocationExecutor extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const head : Moderator[] = await sender.getHead();
        for (const i of head) {
            await i.send(`✡️ Модератор ${sender.getOnlyMention(sender.nick)} купил снятие всех наказаний!`)
        }
        await message.editMessage({message: `✅ Вы купили снятие всех наказаний! Главный Модератор получил информацию и в течение какого-то времени снимет вам их.`}, Messages.TO_STATISTIC(sender.userId))
    }

}