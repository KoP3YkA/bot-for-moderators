import {User} from "./User";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Main} from "../../../../Main";
import {Some} from "../../../types/Some";
import {Time} from "../utils/Time";
import {AdminQuery} from "../database/queries/AdminQuery";
import {AdminsModule} from "../database/modules/AdminsModule";

export class Administrator extends User {

    public nick!: string;
    public appointment!: Time;

    public constructor(userId: number) {
        super(userId);
    }

    public async init() : Some {
        const results : AdminQuery[] = await AdminsModule.select({userId: this.userId}, {order: 'id', limit: 1})
        if (results.length < 1) return;
        this.nick = results[0].nick;
        this.appointment = results[0].appointment;
    }

    public async send(message: string | MessagesSendParams) {
        await Main.getApi().sendMessage(typeof message === 'string' ? {message: message, peer_id: this.userId, random_id: 0} : {...message, peer_id: this.userId, random_id: 0}).catch(err => {return err})
    }

}