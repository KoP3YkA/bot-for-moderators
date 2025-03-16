import {BaseExecutor} from "../../base/executors/BaseExecutor";
import {ChatMessageEvent} from "../events/ChatMessageEvent";
import {Some} from "../../../types/Some";
import {Member} from "../entity/Member";

export class BaseCommandExecutor extends BaseExecutor {

    public async execute(message: ChatMessageEvent) : Some {
        
    }

}