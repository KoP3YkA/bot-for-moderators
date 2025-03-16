import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('getid')
@WithAlias('id')
@WithAlias('ид')
@WithAlias('гетид')
export class GetId extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        let writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, true)
        const user : Member = message.sender;
        await user.init();
        if (user.rank.weight <= Rank.DEFAULT.weight || !writtenUser) writtenUser = user;

        if (writtenUser.userId === 0) return await message.reply({
            message: 'Произошла непредвиденная ошибка!'
        })

        await message.reply({
            message: `Оригинальная ссылка ${await writtenUser.getMention(NameCase.GEN)}:\nhttps://vk.com/${writtenUser.userId > 0 ? 'id' : 'club'}${writtenUser.userId > 0 ? writtenUser.userId : Math.abs(writtenUser.userId)}`
        })
    }

}