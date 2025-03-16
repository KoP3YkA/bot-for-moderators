import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const LongText = ColumnAnnotationFabric.create({
    type: ColumnType.VARCHAR(255),
    notNull: true
})