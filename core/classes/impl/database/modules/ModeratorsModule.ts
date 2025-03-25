import {
    AutoIncrementId,
    Column,
    ColumnType,
    Migration,
    MigrationType,
    ModelAdapter,
    Module,
    NamedTable,
    SelectQueryParams,
    Table
} from "modular-orm";
import {IModerator} from "../../../../interfaces/entity/IModerator";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {Tag} from "../../../../annotations/database/Tag";
import {LongText} from "../../../../annotations/database/LongText";
import {DateColumn} from "../../../../annotations/database/DateColumn";
import {FalseBooleanColumn} from "../../../../annotations/database/Boolean";
import {Integer} from "../../../../annotations/database/Integer";
import {TextColumn} from "../../../../annotations/database/TextColumn";
import {Some} from "../../../../types/Some";
import {ModeratorQuery} from "../queries/ModeratorQuery";

@Table
@NamedTable('moderators')
@Migration(MigrationType.COLUMNS)
export class ModeratorsModule extends Module implements IModerator {

    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @Tag
    public moderatorType : string = "";

    @Tag
    public rang : string = "";

    @LongText
    public nickname : string = "";

    @DateColumn
    public firstAppointment : Date = new Date();

    @DateColumn
    public lastAppointment : Date = new Date();

    @FalseBooleanColumn
    public hasPc : boolean = false;

    @Integer
    public points : number = 0;

    @LongText
    public discord : string = "";

    @TextColumn
    public forum : string = "";

    @Integer
    public age : number = 0;

    @Integer
    public preds : number = 0;

    @Integer
    public vigs : number = 0;

    @Column({
        type: ColumnType.BOOLEAN,
        defaultValue: false,
    })
    public aban : boolean = false;

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(ModeratorsModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<ModeratorQuery[]> => await new ModelAdapter(ModeratorsModule).select(ModeratorQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(ModeratorsModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(ModeratorsModule).delete(where);

}