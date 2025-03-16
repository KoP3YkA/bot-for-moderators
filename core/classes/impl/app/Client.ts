import {API, KeyboardBuilder, MessageContext, MessageEventContext, Updates, Upload} from "vk-io";
import {Nothing} from "../../../types/Nothing";
import {Logging} from "../utils/Logging";
import {Some} from "../../../types/Some";
import {ClientAPI} from "./ClientAPI";
import {PrivateMessageEvent} from "../events/PrivateMessageEvent";
import {PrivateMessageExecutor} from "../../../../logic/private/PrivateMessageExecutor";
import {ChatMessageEvent} from "../events/ChatMessageEvent";
import {RoutingMaps} from "../../../namespaces/RoutingMaps";
import {BaseExecutor} from "../../base/executors/BaseExecutor";
import {Member} from "../entity/Member";
import {ChatButtonEvent} from "../events/ChatButtonEvent";
import {Rank} from "../enums/Rank";
import {Chat} from "../entity/Chat";
import {ChatEvent} from "../../../enums/ChatEvent";
import {ChatExecutorEvent} from "../events/ChatExecutorEvent";
import {Main} from "../../../../Main";
import {System} from "../../../namespaces/System";
import {User} from "../entity/User";
import {PrivateButtonEvent} from "../events/PrivateButtonEvent";
import {Moderator} from "../entity/Moderator";
import {ModeratorRank} from "../enums/ModeratorRank";
import {PanelModeratorRank} from "../enums/PanelModeratorRank";

export class Client {

    private static LAST_MESSAGE : MessageContext;

    private api? : API;
    private upload? : Upload;
    private client? : Updates;

    public async start(token: string) : Nothing {
        const api : API = new API({
            token: token
        })
        this.api = api;

        const upload : Upload = new Upload({api});
        this.upload = upload;

        const client : Updates = new Updates({api, upload});
        this.client = client;

        await this.client.start().then(succ => {Logging.info('Client success started!')})

        client.on('message_new', async (message) => {
            if (message.isOutbox || !message.isInbox) {
                return;
            }
            if (Client.LAST_MESSAGE) {
                if (Client.LAST_MESSAGE.chatId && message.chatId) {
                    if (Client.LAST_MESSAGE.chatId === message.chatId && Client.LAST_MESSAGE.senderId === message.senderId && Client.LAST_MESSAGE.conversationMessageId === message.conversationMessageId) return;
                } else {
                    if (Client.LAST_MESSAGE.senderId === message.senderId && Client.LAST_MESSAGE.conversationMessageId === message.conversationMessageId) return;
                }
            }

            Client.LAST_MESSAGE = message;

            if (message.isChat) return await this.chatMessage(message);
            else return await this.privateMessage(message);
        })

        client.on('message_event', async (event) => {
            if (event.peerId === event.userId) {
                await this.privateButton(event);
            } else await this.chatButtonEvent(event)
        })

        client.on(['chat_invite_user', 'chat_invite_user_by_link', 'chat_kick_user'], async (event) => {
            if (event.eventType === 'chat_kick_user' && event.senderId !== event.eventMemberId as number) return;
            const map : Map<string, ChatEvent> = new Map([
                ['chat_invite_user', ChatEvent.InviteMember],
                ['chat_invite_user_by_link', ChatEvent.MemberJoinedByLink],
                ['chat_kick_user', ChatEvent.MemberLeave]
            ])
            const eventType = map.get(String(event.eventType))
            if (!eventType) return;
            await this.chatEvent(event, eventType)
        })

        Logging.info('All events registered!')

    }

    private async privateMessage(message: MessageContext) : Some {
        const event : PrivateMessageEvent = new PrivateMessageEvent(message)
        await new PrivateMessageExecutor().execute(event);
    }

    private async privateButton(event: MessageEventContext) : Some {
        const message : PrivateButtonEvent = new PrivateButtonEvent(event);
        const command = event.eventPayload['command']
        if (!command) return;

        if (!RoutingMaps.PRIVATE_BUTTONS.has(command)) return
        const executor = RoutingMaps.PRIVATE_BUTTONS.get(command) as Function;
        const _class = new (executor as { new(): BaseExecutor })()

        const sender : Moderator = message.sender;
        if (!await sender.isExists()) return await message.snackbar('Вы не модератор!');

        if (RoutingMaps.PRIVATE_MINIMAL_RANKS.has(_class)) {
            const minimalRank : ModeratorRank = RoutingMaps.PRIVATE_MINIMAL_RANKS.get(_class) as Rank;
            await sender.init()
            if (sender.rank instanceof PanelModeratorRank) return await message.snackbar(`Вы не из основного состава!`);
            if (sender.rank.weight < minimalRank.weight) return await message.snackbar(`Недостаточно прав!`)
        }

        await _class.execute(message);
    }

    private async chatMessage(message: MessageContext) : Some {
        if (!message.chatId) return;

        const chat : Chat = new Chat(message.chatId);
        if (!await chat.isExists()) return;

        const event : ChatMessageEvent = new ChatMessageEvent(message as MessageContext & {chatId: number})
        const sender : Member = event.sender;
        await sender.init();

        await chat.init();

        const isUserHasDefaultRank = sender.rank.weight <= Rank.DEFAULT.weight
        if (chat.silence && isUserHasDefaultRank) return await Main.getApi().deleteMessage(chat.chatId, message.conversationMessageId as number)
        if (chat.filter && message.text && System.BANWORDS.some(word => message.text?.includes(word)) && isUserHasDefaultRank) {
            await message.reply({
                message: `${sender.getOnlyMention('Пользователь')} получил-(а) варн за написание запрещенных слов!`,
                keyboard: new KeyboardBuilder().inline(true).callbackButton({label: 'Снять варн', color: 'positive', payload: {command: 'unwarn', user: sender.userId}})
            }).catch()
            await Main.getApi().deleteMessage(chat.chatId, message.conversationMessageId as number)
            if (sender.warns.length >= 2) await sender.kick()
            await sender.punishmentsService().warn(0, 'Запрещенные слова')
            if (sender.warns.length >= 2) await sender.punishmentsService().clearWarns()
            return;
        }


        if (event.isCommand && sender.rank.weight >= event.command.minimalRank.weight) {
            if (!RoutingMaps.CHAT_COMMANDS.has(event.command.name)) return
            const executor = RoutingMaps.CHAT_COMMANDS.get(event.command.name) as Function;
            const _class = new (executor as { new(): BaseExecutor })()
            return await _class.execute(event);
        } else if (event.isCommand && sender.rank.weight < event.command.minimalRank.weight) {
            await event.reply(`Недостаточно прав!`)
        }
    }

    private async chatEvent(event: MessageContext, eventType: ChatEvent) : Some {
        if (!RoutingMaps.CHAT_EVENTS.has(eventType)) return;
        if (!event.chatId) return;
        const executorClass : BaseExecutor = RoutingMaps.CHAT_EVENTS.get(eventType) as BaseExecutor;
        const message : ChatExecutorEvent = new ChatExecutorEvent(event, eventType)
        const _class = new (executorClass as unknown as { new(): BaseExecutor })()
        await _class.execute(message)
    }

    private async chatButtonEvent(event: MessageEventContext) {
        const message : ChatButtonEvent = new ChatButtonEvent(event);
        const command = event.eventPayload['command']
        if (!command) return;

        if (!RoutingMaps.CHAT_BUTTONS.has(command)) return
        const executor = RoutingMaps.CHAT_BUTTONS.get(command) as Function;
        const _class = new (executor as { new(): BaseExecutor })()

        if (RoutingMaps.BUTTON_MINIMAL_RANKS.has(_class)) {
            const minimalRank : Rank = RoutingMaps.BUTTON_MINIMAL_RANKS.get(_class) as Rank;
            const sender : Member = message.sender;
            await sender.init()
            if (sender.rank.weight < minimalRank.weight) return await message.snackbar(`Недостаточно прав!`)
        }

        await _class.execute(message);
    }

    public get getApi() : ClientAPI {return new ClientAPI(this.api as API);}

}