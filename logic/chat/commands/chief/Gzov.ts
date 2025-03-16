import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatType} from "../../../../core/enums/ChatType";
import {ChatsModule} from "../../../../core/classes/impl/database/modules/ChatsModule";
import {Chat} from "../../../../core/classes/impl/entity/Chat";

@NamedCommand('gzov')
@WithAlias('гзов')
export class Gzov extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        if (message.args.length < 1) return await message.reply(`Укажите тип бесед!`)
        const channelsType = message.args[0]
        const types : Map<string, ChatType> = new Map([
            ['basic', ChatType.BASIC],
            ['player', ChatType.PLAYER],
            ['panel', ChatType.PANEL]
        ])
        if (!types.has(channelsType)) return await message.reply(`
Такого типа не существует!
basic - основной состав модерации
panel - модерация ВК
player - другое
        `)

        if (message.args.length < 2) return await message.reply(`Укажите сообщение!`)
        const reason : string = message.sliceArgs(1)
        const sendMessage = `🔔 Вы были вызваны ${message.sender.getOnlyMention('администратором')} беседы!\n\n@all\n\n❗ Причина: ${reason}`

        await message.reply(`Сообщение успешно отправляется во все беседы!`)

        const allChats = await ChatsModule.select({chatType: channelsType})
        for (const i of allChats) {
            const chat = new Chat(i.chatId)
            await chat.send({message: sendMessage})
        }

    }

}