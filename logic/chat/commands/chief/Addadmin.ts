import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {PermissionsModule} from "../../../../core/classes/impl/database/modules/PermissionsModule";
import {ManagersModule} from "../../../../core/classes/impl/database/modules/ManagersModule";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('addadmin')
@WithAlias('addmdadmin')
@WithAlias('admin')
export class Addadmin extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();
        if (writtenUser.rank.weight >= Rank.MIDDLE_ADMINISTRATOR.weight) return await message.reply(`У пользователя уже есть такая роль!`)

        await PermissionsModule.delete({userId: writtenUser.userId})
        await ManagersModule.delete({userId: writtenUser.userId})
        await ManagersModule.create({userId: writtenUser.userId, rang: Rank.MIDDLE_ADMINISTRATOR.tag})

        await message.reply(`${await sender.getMention(NameCase.NOM)} выдал-(а) права администратора ${await writtenUser.getMention(NameCase.DAT)}!`)
    }

}