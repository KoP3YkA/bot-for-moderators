import {Cash} from "../../../namespaces/Cash";
import {Main} from "../../../../Main";
import {Some} from "../../../types/Some";
import {Member} from "./Member";
import {Rank} from "../enums/Rank";
import {PermissionsModule} from "../database/modules/PermissionsModule";
import {ManagersModule} from "../database/modules/ManagersModule";
import {ManagerQuery} from "../database/queries/ManagerQuery";
import {NicknamesModule} from "../database/modules/NicknamesModule";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {WarnsModule} from "../database/modules/WarnsModule";
import {BanQuery} from "../database/queries/BanQuery";
import {BansModule} from "../database/modules/BansModule";
import {ChatType} from "../../../enums/ChatType";
import {ChatsModule} from "../database/modules/ChatsModule";
import {ChatQuery} from "../database/queries/ChatQuery";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {ButtonColorUnion, KeyboardBuilder} from "vk-io";

export class Chat {

    public staff : Map<Member, Rank> = new Map();
    public nicks : Map<Member, string> = new Map();

    public grid : string | null = null;
    public silence : boolean = false;
    public private : boolean = true; // Можно ли приглашать участников
    public type : ChatType = ChatType.BASIC;
    public filter : boolean = true;

    public constructor(
        public chatId: number
    ) {}

    public async init() : Some {
        const staffResult = await PermissionsModule.select({
            chatId: this.chatId
        })
        for (const i of staffResult) {
            if (i.role === Rank.DEFAULT) continue;
            this.staff.set(new Member(i.userId, this.chatId), i.role)
        }

        const nicksResult = await NicknamesModule.select({
            chatId: this.chatId
        })
        for (const i of nicksResult) {
            this.nicks.set(new Member(i.userId, this.chatId), i.nickname)
        }

        const chatResults = await ChatsModule.select({chatId: this.chatId}, {order: 'id', limit: 1})
        if (chatResults.length > 0) {
            const chat : ChatQuery = chatResults[0]
            this.grid = chat.grid;
            this.silence = chat.silence;
            this.private = chat.private;
            this.type = chat.chatType;
            this.filter = chat.filter;
        }
    }

    public async isExists() : Promise<boolean> {
        const res = await ChatsModule.select({chatId: this.chatId})
        return res.length > 0
    }

    public async editQuiet(mode: boolean = !this.silence) : Some {
        await ChatsModule.update({silence: mode}, {chatId: this.chatId})
    }

    public async editPrivate(mode: boolean = !this.private) : Some {
        await ChatsModule.update({private: mode}, {chatId: this.chatId})
    }

    public async editType(newType: ChatType) : Some {
        await ChatsModule.update({chatType: newType}, {chatId: this.chatId})
    }

    public async editServer(grid: string) : Some {
        await ChatsModule.update({grid: grid}, {chatId: this.chatId})
    }

    public async editFilter(filter: boolean = !this.filter) : Some {
        await ChatsModule.update({filter}, {chatId: this.chatId})
    }

    public async getGridChats(ignoreType : boolean = false) : Promise<Chat[]> {
        let res : ChatQuery[]
        if (ignoreType) res = await ChatsModule.select({
            grid: this.grid,
        })
        else res = await ChatsModule.select({
            grid: this.grid,
            chatType: this.type
        })
        return res.map(query => new Chat(query.chatId))
    }

    public async kickMember(userId: number) : Promise<boolean> {
        return await new Member(userId, this.chatId).kick()
    }

    public async getTitle() : Promise<string> {
        if (Cash.CHAT_TITLES.has(this.chatId)) return Cash.CHAT_TITLES.get(this.chatId) as string;

        const res : string = await Main.getApi().getChatTitle(this.chatId)
        Cash.CHAT_TITLES.set(this.chatId, res);
        return res;
    }

    public async getOwner() : Promise<Member> {
        const user = await Main.getApi().getChatOwner(this.chatId)
        return new Member(user, this.chatId)
    }

    public async getManagers() : Promise<Set<Member>> {
        const allManagers : ManagerQuery[] = await ManagersModule.select({})
        const allMembers : Set<Member> = await Main.getApi().getChatMembers(this.chatId)

        const managerIds = new Set(allManagers.map(manager => manager.userId));

        const commonMembers = new Set(
            [...allMembers].filter(member => managerIds.has(member.userId))
        );

        return commonMembers

    }

    public getMembers = async () => await Main.getApi().getChatMembers(this.chatId);

    public getNicksByPage(page: number) : Map<Member, string> {
        const PAGE_SIZE : number = 40;
        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;

        const pagedEntries = Array.from(this.nicks.entries()).slice(startIdx, endIdx);
        return new Map(pagedEntries);
    }

    public async getBanListByPage(page: number) : Promise<Map<Member, BanQuery>> {
        let results = await BansModule.select({chatId: this.chatId}, {order: 'id'})
        const finalRes : Map<Member, BanQuery> = new Map()

        const PAGE_SIZE : number = 40;
        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;

        results = results.slice(startIdx, endIdx)

        for (const i of results) {
            finalRes.set(new Member(i.userId, this.chatId), i)
        }
        return finalRes
    }

    public async getNonickByPage(page: number) : Promise<Set<Member>> {
        const allMembers : Set<Member> = await Main.getApi().getChatMembers(this.chatId)

        const nlistIds = new Set(Array.from(this.nicks.keys()).map(user => user.userId));

        const commonMembers = [...allMembers].filter(member => !(nlistIds.has(member.userId)))

        const PAGE_SIZE : number = 40;
        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;

        const pagedEntries = commonMembers.slice(startIdx, endIdx);
        return new Set(pagedEntries);
    }

    public async getWarnsByPage(page: number) : Promise<Map<Member, number>> {
        const PAGE_SIZE : number = 40;
        const warns = await WarnsModule.select({chatId: this.chatId, active: true})
        const warnsMap : Map<number, number> = new Map()
        const resultMap : Map<Member, number> = new Map()

        for (const i of warns) {
            let warnsCount : number = 0;
            if (warnsMap.has(i.userId)) warnsCount = (warnsMap.get(i.userId) as number) + 1;
            else warnsCount = 1;
            warnsMap.set(i.userId, warnsCount)
        }

        for (const i of warnsMap) {
            resultMap.set(new Member(i[0], this.chatId), i[1])
        }

        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;
        const pagedEntries = Array.from(resultMap.entries()).slice(startIdx, endIdx);
        return new Map(pagedEntries);
    }

    private getCallbackButtons(button: PayloadButton[]) {
        const keyboard = new KeyboardBuilder()
        keyboard.inline(true)
        for (const i of button) {
            keyboard.callbackButton({
                label: i.title,
                color: i.color as ButtonColorUnion,
                payload: i.payload
            })
        }
        return keyboard
    }

    public async send(params: MessagesSendParams, ...button: PayloadButton[]) : Some {
        return await Main.getApi().sendMessage({
            ...params,
            peer_id: 2_000_000_000 + this.chatId,
            random_id: 0,
            keyboard: this.getCallbackButtons(button)
        })
    }

}