import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Member} from "../../../../core/classes/impl/entity/Member";

@NamedCommand('zov')
@WithAlias('зов')
@WithAlias('вызов')
@WithAlias('славаукраине')
export class Zov extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        if (message.args.length < 1) return await message.reply(`Укажите причину вызова!`)
        const reason : string = message.getFullArgs;
        const chat : Chat = message.chat;
        const sender : Member = message.sender;

        const members : Set<Member> = await chat.getMembers();
        const chunkSize : number = 100;

        for (let i = 0; i < members.size; i += chunkSize) {
            const chunk : Member[] = Array.from(members).slice(i, i + chunkSize);

            await chat.send({
                message: `
🔔 Вы были вызваны ${sender.getOnlyMention('администратором')} беседы

${chunk.map(user => user.getOnlyMention('🖤')).join('')}

❗ Причина вызова: ${reason}
                `
            })

        }

    }

}