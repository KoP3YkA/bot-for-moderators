import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const Integer = ColumnAnnotationFabric.create({
    type: ColumnType.INTEGER,
    notNull: true
})