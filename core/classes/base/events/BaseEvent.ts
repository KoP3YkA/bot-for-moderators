import {User} from "../../impl/entity/User";

export abstract class BaseEvent {
    public abstract apiEvent : any;
    public abstract sender : User;

    public abstract send(args: any) : any;
    public abstract reply(args: any) : any;
}