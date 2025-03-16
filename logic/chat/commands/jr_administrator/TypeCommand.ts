import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {ToChatType} from "../../../../core/annotations/database/ToChatType";
import {ChatType} from "../../../../core/enums/ChatType";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('type')
@WithAlias('settype')
@WithAlias('тип')
export class TypeCommand extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        if (message.args.length < 1) return await message.reply(`Укажите тип беседы!`)

        const newType : string = message.args[0];
        const types : Map<string, ChatType> = new Map([
            ['basic', ChatType.BASIC],
            ['player', ChatType.PLAYER],
            ['panel', ChatType.PANEL]
        ])
        if (!types.has(newType)) return await message.reply(`
Такого типа не существует!
basic - основной состав модерации
panel - модерация ВК
player - другое
        `)

        const chat : Chat = message.chat;
        await chat.editType(types.get(newType) as ChatType)
        await message.reply(`${await message.sender.getMention(NameCase.NOM)}, изменил-(а) тип беседы на <<${newType}>>`)
    }

}