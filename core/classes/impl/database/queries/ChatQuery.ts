import {IsBoolean, IsNotNull, IsNumber, IsUUID, QueryResult, Result, Validate} from "modular-orm";
import {IChat} from "../../../../interfaces/entity/IChat";
import {ChatType} from "../../../../enums/ChatType";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToChatType} from "../../../../annotations/database/ToChatType";

export class ChatQuery extends QueryResult implements IChat, Validate {
    @Result()
    @IsNumber
    public id : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public chatId : number = 0;

    @Result()
    @IsBoolean
    public silence : boolean = false;

    @Result()
    @IsBoolean
    public filter : boolean = false;

    @Result()
    @IsBoolean
    public private : boolean = false;

    @Result()
    @IsUUID
    public grid : string = "";

    @Result()
    @ToChatType
    @IsNotNull
    public chatType : ChatType = ChatType.BASIC;

    public validateErrors: Set<string> = new Set();
}