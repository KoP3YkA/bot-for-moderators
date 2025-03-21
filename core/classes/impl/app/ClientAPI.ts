import {API} from "vk-io";
import {Some} from "../../../types/Some";
import {MessagesEditParams, MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Nullable} from "../../../types/Nullable";
import {NameCase} from "../enums/NameCase";
import {BaseNameCase} from "vk-io/lib/api/schemas/objects";
import {Cash} from "../../../namespaces/Cash";
import {Member} from "../entity/Member";

export class ClientAPI {

    public constructor(
        public api: API
    ) {}

    public async sendMessage(message: MessagesSendParams) : Some {
        await this.api.messages.send(message).catch(err => {return err})
    }

    public async editMessage(params: MessagesEditParams) : Some {
        await this.api.messages.edit(params).catch(err => {return err})
    }

    public async getUserByTag(id: string) : Nullable<number> {
        const cashResult = Cash.USER_TAGS.get(id)
        if (cashResult) return cashResult === 0 ? null : cashResult;
        const res = await this.api.users.get({
            user_ids: [id]
        })
        let returnResult : number;
        if (res.length < 1) returnResult = 0
        else returnResult = res[0].id ?? 0

        Cash.USER_TAGS.set(id, returnResult)
        return returnResult === 0 ? null : returnResult;
    }

    public async getUserName(userId: number, nameCase: NameCase) : Promise<string> {
        const res = await this.api.users.get({
            user_ids: [+userId],
            name_case: nameCase.tag as BaseNameCase
        }).catch(err => {return err})

        if (!res) return 'Не Найден'
        const user = res[0]
        return `${user.first_name} ${user.last_name}`
    }

    public async getGroupName(groupId: number) : Promise<string> {
        const res = await this.api.groups.getById({
            group_id: groupId < 0 ? Math.abs(groupId) : groupId
        }).catch(err => {return err})
        if (!res || !res.groups || res.groups.length < 1) return 'Не найдено'
        return res.groups[0].name
    }

    public async getGroupByTag(groupId: string) : Promise<number> {
        const cashResult = Cash.USER_TAGS.get(groupId)
        if (cashResult) return cashResult;
        const res = await this.api.groups.getById({
            group_id: groupId
        }).catch(err => {return err})
        let returnResult : number;
        if (!res || !res.groups || res.groups.length < 1) returnResult = 0
        else returnResult = res.groups[0].id;

        Cash.USER_TAGS.set(groupId, returnResult)
        return returnResult;
    }

    public async kickUserFromChat(userId: number, chatId: number) : Promise<boolean> {
        return await this.api.messages.removeChatUser({
            chat_id: chatId,
            user_id: userId
        }).then(succ => true).catch(rej => false)
    }

    public async getChatOwner(chatId: number) : Promise<number> {
        const response = await this.api.messages.getConversationsById({
            peer_ids: 2_000_000_000 + Number(chatId),
        });

        const conversation = response.items[0];

        if (!conversation || !conversation.chat_settings) return 0

        return conversation.chat_settings.owner_id;
    }

    public async getChatTitle(chatId: number) : Promise<string> {
        const response = await this.api.messages.getConversationsById({
            peer_ids: 2_000_000_000 + Number(chatId),
        });

        const conversation = response.items[0];

        if (!conversation || !conversation.chat_settings) return 'Ошибка'

        return conversation.chat_settings.title;
    }

    public async getChatMembers(chatId: number) : Promise<Set<Member>> {
        const res = await this.api.messages.getConversationMembers({
            peer_id: 2_000_000_000 + chatId,
            fields: ['online', 'online_info']
        })
        const members : Set<Member> = new Set()

        for (const i of res.profiles) {
            members.add(new Member(i.id, chatId))
        }

        return members;
    }

    public async deleteMessage(chatId: number, cmid: number) : Some {
        await this.api.messages.delete({
            delete_for_all: true,
            cmids: [cmid],
            peer_id: 2_000_000_000 + chatId
        })
    }

    public async getMessageText(chatId: number, cmid: number) : Promise<string> {
        const res = await this.api.messages.getByConversationMessageId({
            peer_id: 2_000_000_000 + chatId,
            conversation_message_ids: [cmid]
        })
        if (res.items.length < 1) return 'undefined'
        else return res.items[0].text ?? 'undefined'
    }

    public async getUserMentionsByIds(userIds: number[]) : Promise<Map<number, string>> {
        const res = await this.api.users.get({
            user_ids: userIds
        })
        const map : Map<number, string> = new Map;
        for (const i of res) {
            map.set(i.id, `[id${i.id}|${i.first_name} ${i.last_name}]`)
        }
        return map;
    }

}