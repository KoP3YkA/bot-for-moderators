import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('stats')
@WithAlias('statistic')
@WithAlias('стата')
export class Statistic extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        let writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, true)
        const user : Member = message.sender;
        await user.init();
        if (user.rank.weight <= Rank.DEFAULT.weight || !writtenUser) writtenUser = user;
        await writtenUser.init();
        if (user.rank.weight <= Rank.DEFAULT.weight) {
            await message.reply({
                message: await writtenUser.getStatistic().getStatisticMessage()
            })
        } else {
            await message.replyWithButtons({
                message: await writtenUser.getStatistic().getStatisticMessage()
            }, ...Messages.GET_STATS_BUTTONS(writtenUser.userId))
        }
    }

}