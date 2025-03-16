import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IChat} from "../../../../interfaces/entity/IChat";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {FalseBooleanColumn, TrueBooleanColumn} from "../../../../annotations/database/Boolean";
import {Tag} from "../../../../annotations/database/Tag";
import {Some} from "../../../../types/Some";
import {ChatQuery} from "../queries/ChatQuery";

@Table
@NamedTable('chats')
export class ChatsModule extends Module implements IChat {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public chatId : string = "";

    @FalseBooleanColumn
    public silence : boolean = false;

    @TrueBooleanColumn
    public filter : boolean = false;

    @TrueBooleanColumn
    public private : boolean = false;

    @Tag
    public grid : string = "";

    @Tag
    public chatType : string = "";

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(ChatsModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<ChatQuery[]> => await new ModelAdapter(ChatsModule).select(ChatQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(ChatsModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(ChatsModule).delete(where);


}