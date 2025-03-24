import {ModeratorsModule} from "../database/modules/ModeratorsModule";
import {PermissionsModule} from "../database/modules/PermissionsModule";
import {BansModule} from "../database/modules/BansModule";
import {ChatsModule} from "../database/modules/ChatsModule";
import {GlobalBansModule} from "../database/modules/GlobalBansModule";
import {NicknamesModule} from "../database/modules/NicknamesModule";
import {WarnsModule} from "../database/modules/WarnsModule";
import {FirstMessagesModule} from "../database/modules/FirstMessagesModule";
import {Help} from "../../../../logic/chat/commands/user/Help";
import {Info} from "../../../../logic/chat/commands/user/Info";
import {ManagersModule} from "../database/modules/ManagersModule";
import {GetId} from "../../../../logic/chat/commands/user/GetId";
import {Statistic} from "../../../../logic/chat/commands/user/Statistic";
import {Kick} from "../../../../logic/chat/commands/jr_moderator/Kick";
import {Warn} from "../../../../logic/chat/commands/jr_moderator/Warn";
import {Unwarn} from "../../../../logic/chat/commands/jr_moderator/Unwarn";
import {GetBan} from "../../../../logic/chat/commands/jr_moderator/GetBan";
import {GetWarn} from "../../../../logic/chat/commands/jr_moderator/GetWarn";
import {WarnHistory} from "../../../../logic/chat/commands/jr_moderator/WarnHistory";
import {Staff} from "../../../../logic/chat/commands/jr_moderator/Staff";
import {SetNick} from "../../../../logic/chat/commands/jr_moderator/SetNick";
import {RemoveNick} from "../../../../logic/chat/commands/jr_moderator/RemoveNick";
import {Nlist} from "../../../../logic/chat/commands/jr_moderator/Nlist";
import {NoNick} from "../../../../logic/chat/commands/jr_moderator/NoNick";
import {NoNickButton} from "../../../../logic/chat/buttons/NoNickButton";
import {NlistButton} from "../../../../logic/chat/buttons/NlistButton";
import {NlistMinusButton} from "../../../../logic/chat/buttons/NlistMinusButton";
import {NlistPlusButton} from "../../../../logic/chat/buttons/NlistPlusButton";
import {NonickMinusButton} from "../../../../logic/chat/buttons/NonickMinusButton";
import {NonickPlusButton} from "../../../../logic/chat/buttons/NonickPlusButton";
import {GetNick} from "../../../../logic/chat/commands/jr_moderator/GetNick";
import {GetAcc} from "../../../../logic/chat/commands/jr_moderator/GetAcc";
import {WarnList} from "../../../../logic/chat/commands/jr_moderator/WarnList";
import {Clear} from "../../../../logic/chat/commands/jr_moderator/Clear";
import {GetBanButton} from "../../../../logic/chat/buttons/GetBanButton";
import {GetWarnButton} from "../../../../logic/chat/buttons/GetWarnButton";
import {StatisticButton} from "../../../../logic/chat/buttons/StatisticButton";
import {WarnhistoryButton} from "../../../../logic/chat/buttons/WarnhistoryButton";
import {UnwarnButton} from "../../../../logic/chat/buttons/UnwarnButton";
import {Ban} from "../../../../logic/chat/commands/sr_moderator/Ban";
import {Unban} from "../../../../logic/chat/commands/sr_moderator/Unban";
import {UnbanButton} from "../../../../logic/chat/buttons/UnbanButton";
import {AddModer} from "../../../../logic/chat/commands/sr_moderator/AddModer";
import {RemoveRole} from "../../../../logic/chat/commands/sr_moderator/RemoveRole";
import {Zov} from "../../../../logic/chat/commands/sr_moderator/Zov";
import {BanList} from "../../../../logic/chat/commands/sr_moderator/BanList";
import {BanlistMinusButton} from "../../../../logic/chat/buttons/BanlistMinusButton";
import {BanlistPlusButton} from "../../../../logic/chat/buttons/BanlistPlusButton";
import {Skick} from "../../../../logic/chat/commands/jr_administrator/Skick";
import {Quiet} from "../../../../logic/chat/commands/jr_administrator/Quiet";
import {QuietButton} from "../../../../logic/chat/buttons/QuietButton";
import {Settings} from "../../../../logic/chat/commands/jr_administrator/Settings";
import {SettingsButton} from "../../../../logic/chat/buttons/SettingsButton";
import {PrivateButton} from "../../../../logic/chat/buttons/PrivateButton";
import {Sban} from "../../../../logic/chat/commands/jr_administrator/Sban";
import {Sunban} from "../../../../logic/chat/commands/jr_administrator/Sunban";
import {SunbanButton} from "../../../../logic/chat/buttons/SunbanButton";
import {Addsenmoder} from "../../../../logic/chat/commands/jr_administrator/Addsenmoder";
import {TypeCommand} from "../../../../logic/chat/commands/jr_administrator/TypeCommand";
import {Server} from "mysql2/typings/mysql/lib/Server";
import {ServerCommand} from "../../../../logic/chat/commands/jr_administrator/ServerCommand";
import {Gbanlist} from "../../../../logic/chat/commands/jr_administrator/Gbanlist";
import {GbanlistMinusButton} from "../../../../logic/chat/buttons/GbanlistMinusButton";
import {GbanlistPlusButton} from "../../../../logic/chat/buttons/GbanlistPlusButton";
import {FilterButton} from "../../../../logic/chat/buttons/FilterButton";
import {Filter} from "../../../../logic/chat/commands/jr_administrator/Filter";
import {Gban} from "../../../../logic/chat/commands/administrator/Gban";
import {Gunban} from "../../../../logic/chat/commands/administrator/Gunban";
import {GunbanButton} from "../../../../logic/chat/buttons/GunbanButton";
import {Sync} from "../../../../logic/chat/commands/administrator/Sync";
import {Gremoverole} from "../../../../logic/chat/commands/administrator/Gremoverole";
import {Addjradmin} from "../../../../logic/chat/commands/administrator/Addjradmin";
import {Urkick} from "../../../../logic/chat/commands/administrator/Urkick";
import {Addadmin} from "../../../../logic/chat/commands/chief/Addadmin";
import {Gzov} from "../../../../logic/chat/commands/chief/Gzov";
import {MemberLeave} from "../../../../logic/chat/events/MemberLeave";
import {MemberJoinedByLink} from "../../../../logic/chat/events/MemberJoinedByLink";
import {MemberInvited} from "../../../../logic/chat/events/MemberInvited";
import {ModeratorsButton} from "../../../../logic/private/buttons/ModeratorsButton";
import {PrivateStatisticButton} from "../../../../logic/private/buttons/PrivateStatisticButton";
import {EditStatsButton} from "../../../../logic/private/buttons/EditStatsButton";
import {NewModerator} from "../../../../logic/private/commands/NewModerator";
import {StatsCommand} from "../../../../logic/private/commands/StatsCommand";
import {PrivateKickButton} from "../../../../logic/private/buttons/PrivateKickButton";
import {PrivateKick} from "../../../../logic/private/commands/PrivateKick";
import {PrivateSetRank} from "../../../../logic/private/commands/PrivateSetRank";
import {PrivateWarn} from "../../../../logic/private/commands/PrivateWarn";
import {PrivateUnwarn} from "../../../../logic/private/commands/PrivateUnwarn";
import {Pred} from "../../../../logic/private/commands/Pred";
import {Points} from "../../../../logic/private/commands/Points";
import {PrivateHelp} from "../../../../logic/private/commands/PrivateHelp";
import {CancelButton} from "../../../../logic/private/buttons/CancelButton";
import {PrivateNews} from "../../../../logic/private/commands/PrivateNews";
import {MagazineButton} from "../../../../logic/private/buttons/MagazineButton";
import {AdminsModule} from "../database/modules/AdminsModule";
import {MagazineProductButton} from "../../../../logic/private/buttons/MagazineProductButton";
import {RouletteExecutor} from "../../../../logic/private/buttons/products/RouletteExecutor";
import {ZrmSignatureExecutor} from "../../../../logic/private/buttons/products/ZrmSignatureExecutor";
import {HolidayExecutor} from "../../../../logic/private/buttons/products/HolidayExecutor";
import {PunishmentRevocationExecutor} from "../../../../logic/private/buttons/products/PunishmentRevocationExecutor";
import {FaStatsExecutor} from "../../../../logic/private/buttons/products/FaStatsExecutor";
import {Gremovenick} from "../../../../logic/chat/commands/administrator/Gremovenick";
import {SuggestionsButton} from "../../../../logic/private/buttons/SuggestionsButton";
import {Chats} from "../../../../logic/chat/commands/administrator/Chats";
import {ChatsMinusButton} from "../../../../logic/chat/buttons/ChatsMinusButton";
import {ChatsPlusButton} from "../../../../logic/chat/buttons/ChatsPlusButton";

export class ApplicationInit {

    public static init() {
        new ModeratorsModule()
        new PermissionsModule()
        new BansModule()
        new ChatsModule()
        new GlobalBansModule()
        new NicknamesModule()
        new WarnsModule()
        new FirstMessagesModule()
        new ManagersModule()
        new AdminsModule()

        new NoNickButton()
        new NlistButton()
        new NlistMinusButton()
        new NlistPlusButton()
        new NonickMinusButton()
        new NonickPlusButton()
        new GetBanButton()
        new GetWarnButton()
        new StatisticButton()
        new WarnhistoryButton()
        new UnwarnButton()
        new UnbanButton()
        new BanlistMinusButton()
        new BanlistPlusButton()
        new QuietButton()
        new SettingsButton()
        new PrivateButton()
        new SunbanButton()
        new GbanlistMinusButton()
        new GbanlistPlusButton()
        new FilterButton()
        new GunbanButton()
        new ChatsMinusButton()
        new ChatsPlusButton()

        new Help()
        new Info()
        new GetId()
        new Statistic()
        new Kick()
        new Warn()
        new Unwarn()
        new GetBan()
        new GetWarn()
        new WarnHistory()
        new Staff()
        new SetNick()
        new RemoveNick()
        new Nlist()
        new NoNick()
        new GetNick()
        new GetAcc()
        new WarnList()
        new Clear()
        new Ban()
        new Unban()
        new AddModer()
        new RemoveRole()
        new Zov()
        new BanList()
        new Skick()
        new Quiet()
        new Settings()
        new Sban()
        new Sunban()
        new Addsenmoder()
        new TypeCommand()
        new ServerCommand()
        new Gbanlist()
        new Filter()
        new Gban()
        new Gunban()
        new Sync()
        new Gremoverole()
        new Addjradmin()
        new Urkick()
        new Addadmin()
        new Gzov()
        new Gremovenick()
        new Chats()

        new MemberLeave()
        new MemberJoinedByLink()
        new MemberInvited()

        new ModeratorsButton()
        new PrivateStatisticButton()
        new EditStatsButton()
        new NewModerator()
        new StatsCommand()
        new PrivateKickButton()
        new PrivateKick()
        new PrivateSetRank()
        new PrivateWarn()
        new PrivateUnwarn()
        new Pred()
        new Points()
        new PrivateHelp()
        new CancelButton()
        new PrivateNews()
        new MagazineButton()
        new MagazineProductButton()
        new RouletteExecutor()
        new ZrmSignatureExecutor()
        new HolidayExecutor()
        new PunishmentRevocationExecutor()
        new FaStatsExecutor()
        new SuggestionsButton()
    }

}