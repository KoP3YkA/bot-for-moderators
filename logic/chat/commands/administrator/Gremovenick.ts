import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {NicknamesModule} from "../../../../core/classes/impl/database/modules/NicknamesModule";

@NamedCommand('gremovenick')
@WithAlias('grnick')
export class Gremovenick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        await NicknamesModule.delete({userId: writtenUser.userId})

        await message.reply(`${await sender.getMention(NameCase.NOM)} забрал-(а) ники во всех беседах у ${await writtenUser.getMention(NameCase.GEN)}`)
    }

}