import {Environ} from "../classes/impl/utils/Environ";
import {DatabaseParams} from "modular-orm";

export namespace EnvironNamespace {

    export const BOT_TOKEN : string = Environ.getEnvironByField<string>('BOT_TOKEN')

    export const DATABASE_CONNECTION_DATA : DatabaseParams = {
        database: Environ.getEnvironByField<string>('MYSQL_DATABASE'),
        host: Environ.getEnvironByField<string>('MYSQL_HOST'),
        user: Environ.getEnvironByField<string>('MYSQL_USER'),
        port: +Environ.getEnvironByField<string>('MYSQL_PORT'),
        password: Environ.getEnvironByField<string>('MYSQL_PASSWORD')
    }

}