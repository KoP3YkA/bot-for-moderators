import {ColumnAnnotationFabric, ColumnParams, ColumnType} from "modular-orm";

const booleanType : Partial<ColumnParams> = {
    type: ColumnType.BOOLEAN,
    notNull: true
}

export const BooleanColumn = ColumnAnnotationFabric.create(booleanType)

export const TrueBooleanColumn = ColumnAnnotationFabric.create({...booleanType, defaultValue: true})

export const FalseBooleanColumn = ColumnAnnotationFabric.create({...booleanType, defaultValue: false})