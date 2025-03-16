import {BaseExecutor} from "../../base/executors/BaseExecutor";
import {ChatExecutorEvent} from "../events/ChatExecutorEvent";
import {Some} from "../../../types/Some";

export class BaseChatEventExecutor extends BaseExecutor {

    public async execute(message: ChatExecutorEvent) : Some {

    }

}