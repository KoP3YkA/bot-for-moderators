import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {NicknamesModule} from "../../../../core/classes/impl/database/modules/NicknamesModule";
import {NicknameQuery} from "../../../../core/classes/impl/database/queries/NicknameQuery";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {User} from "../../../../core/classes/impl/entity/User";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('getacc')
@WithAlias('гетакк')
@WithAlias('аккаунт')
export class GetAcc extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const nick : string = message.getFullArgs;
        const nicksResult : NicknameQuery[] = await NicknamesModule.select({
            chatId: message.chat.chatId,
            nickname: nick
        }, {order: 'id', limit: 1})

        if (nicksResult.length < 1) return await message.reply(`Пользователь с таким ником не найден!`)
        const newUser : User = new User(nicksResult[0].userId);
        await message.reply(`Ник ${nick} принадлежит — ${await newUser.getMention(NameCase.DAT)}`)
    }

}