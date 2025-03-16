import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Rank} from "../../../core/classes/impl/enums/Rank";
import {Messages} from "../../../core/namespaces/Messages";

@NamedChatButton('statistic')
@MinimalRank(Rank.JUNIOR_MODERATOR)
export class StatisticButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        await writtenUser.init()
        await message.editMessage({
            message: await writtenUser.getStatistic().getStatisticMessage()
        }, ...Messages.GET_STATS_BUTTONS(writtenUser.userId))
    }

}