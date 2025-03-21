import {BasePrivateButtonExecutor} from "../../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../../core/types/Some";
import {Moderator} from "../../../../core/classes/impl/entity/Moderator";
import {ProductRouting} from "../../../../core/annotations/routing/ProductRouting";
import {Messages} from "../../../../core/namespaces/Messages";

@ProductRouting('holiday')
export class HolidayExecutor extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const head : Moderator[] = await sender.getHead();
        for (const i of head) {
            await i.send(`✡️ Модератор ${sender.getOnlyMention(sender.nick)} купил выходной!`)
        }
        await message.editMessage({message: `✅ Вы купили выходной! Главный Модератор получил информацию.`}, Messages.TO_STATISTIC(sender.userId))
    }

}