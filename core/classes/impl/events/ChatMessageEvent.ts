import {BaseEvent} from "../../base/events/BaseEvent";
import {ButtonColorUnion, KeyboardBuilder, MessageContext} from "vk-io";
import {Member} from "../entity/Member";
import {Chat} from "../entity/Chat";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Some} from "../../../types/Some";
import {System} from "../../../namespaces/System";
import {Command} from "../enums/Command";
import {Nullable} from "../../../types/Nullable";
import {Regex} from "../enums/Regex";
import {User} from "../entity/User";
import {Messages} from "../../../namespaces/Messages";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";

export class ChatMessageEvent extends BaseEvent {

    public apiEvent: MessageContext & {chatId: number};
    public sender: Member;
    public chat: Chat;

    public text: string = "";

    public isCommand: boolean = false;
    public command!: Command;
    public args: string[];

    public nextArg: number = 0;

    public constructor(apiEvent: MessageContext & {chatId: number}) {
        super();
        this.apiEvent = apiEvent;
        this.sender = new Member(apiEvent.senderId, apiEvent.chatId);
        this.chat = new Chat(apiEvent.chatId);
        this.text = apiEvent.text ?? "";
        const isCommand = this.isCommandVoid();
        if (isCommand) {
            this.isCommand = true;
            this.command = isCommand;
        }
        this.args = this.getArgs();
    }

    private isCommandVoid() : Command | false {
        let message = this.apiEvent.text;

        if (!message) return false;
        message = message.split(' ')[0]
        if (message.length < 2) return false;
        if (!(System.COMMAND_PREFIXES.includes(message[0]))) return false;

        const command : string = message.slice(1);
        return Command.findByName(command.toLowerCase()) ?? false;
    }

    public getArgs() : string[] {
        const args = this.text.split(' ');
        if (args.length < 2) return []
        return args.slice(1)
    }

    public sliceArgs(min: number, max?: number): string {
        if (max === undefined) return this.args.slice(min).join(' ');
        return this.args.slice(min, min + max).join(' ');
    }

    public async getIdFromArgument(arg: number = 0, allowGroups: boolean = false) : Nullable<Member> {
        const argsList : Array<string> = this.args;
        if (argsList.length < arg+1) return null;
        const currencyText : string = argsList[arg];

        let userId: number | string;
        if (!isNaN(+currencyText)) {
            userId = +currencyText;
            if ((userId < 0 && !allowGroups) || userId === 0) return null;
            return new Member(+currencyText, this.chat.chatId);
        }

        let match : RegExpMatchArray | null;
        if ((match = currencyText.match(Regex.USER_OR_GROUP_MENTION))) {
            userId = currencyText.startsWith('[club') ? ~+match[2] + 1 : +match[2];
            return (userId < 0 && !allowGroups) ? null : new Member(userId, this.chat.chatId);
        }

        if ((match = currencyText.match(Regex.URL_GET))) {
            userId = match[1];
            if (isNaN(+userId)) {
                const user = await User.instanceByTag(userId);
                return user.userId && (user.userId > 0 || allowGroups) ? new Member(user.userId, this.chat.chatId) : null;
            }
            userId = +userId;
            return (userId && (userId > 0 || allowGroups)) ? new Member(userId, this.chat.chatId) : null;
        }

        const user = await User.instanceByTag(currencyText);
        return user.userId && (user.userId > 0 || allowGroups) ? new Member(user.userId, this.chat.chatId) : null;

    }

    private replyMessageUser() : Member | null {
        if (!this.apiEvent.replyMessage) return null;
        return new Member(this.apiEvent.replyMessage.senderId, this.chat.chatId);
    }

    private firstForwardUser() : Member | null {
        if (this.apiEvent.forwards.length < 1) return null;
        return new Member(this.apiEvent.forwards[0].senderId, this.chat.chatId)
    }

    public async getIdFromMessageWithArgument(arg: number = 0, allowGroups: boolean = false) : Nullable<Member> {
        const replyUser : Member | null = this.replyMessageUser();
        if (replyUser) {
            if (replyUser.isBot() && !allowGroups) return null;
            this.nextArg = arg;
            return replyUser
        }

        const forwardUser : Member | null = this.firstForwardUser();
        if (forwardUser) {
            if (forwardUser.isBot() && !allowGroups) return null;
            this.nextArg = arg;
            return forwardUser;
        }

        const writtenUser : Member | null = await this.getIdFromArgument(arg, allowGroups);
        if (writtenUser) {
            if (writtenUser.isBot() && !allowGroups) return null;
            this.nextArg = arg+1;
            return writtenUser;
        }

        return null;
    }

    public async replySelectUser() : Some {
        return await this.reply({
            message: Messages.SELECT_USER
        })
    }

    public async replyCannotUseForThisUser() : Some {
        return await this.reply({
            message: Messages.CANNOT_USE_FOR_THIS_USER
        })
    }

    public get getFullArgs() : string {return this.args.join(' ');}

    public async send(message: MessagesSendParams | string) : Some {
        return await this.apiEvent.send(typeof message === 'string' ? {message: message, disable_mentions: true} : {...message, disable_mentions: true}).catch(err => {return err})
    }

    public async reply(message: MessagesSendParams | string) : Some {
        return await this.apiEvent.reply(typeof message === 'string' ? {message: message, disable_mentions: true} : {...message, disable_mentions: true}).catch(err => {return err})
    }

    public async replyWithButtons(message: MessagesSendParams | string, ...button: PayloadButton[]) : Some {
        const params : MessagesSendParams = typeof message === 'string' ? {message: message} : message
        return await this.reply({...params, keyboard: this.getCallbackButtons(button)})
    }

    public async sendWithButtons(message: MessagesSendParams | string, ...button: PayloadButton[]) : Some {
        const params : MessagesSendParams = typeof message === 'string' ? {message: message} : message
        return await this.send({...params, keyboard: this.getCallbackButtons(button)})
    }

}