import {GlobalBanQuery} from "../../classes/impl/database/queries/GlobalBanQuery";

export interface IUser {
    stringUserId: string,
    globalBan: GlobalBanQuery | null,
}