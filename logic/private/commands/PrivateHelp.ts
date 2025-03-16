import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";

@PrivateCommand('help')
@PrivateCommand('помощь')
export class PrivateHelp extends BaseExecutor {

    public async execute(message: PrivateMessageEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        if (sender.rank instanceof PanelModeratorRank || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        const map : Map<ModeratorRank, string> = new Map([
            [ModeratorRank.CURATOR, `- points (баллы/поинты/point/поинт) - изменяет количество баллов модератору.\n- пред (предупреждение) - выдает модератору предупреждение. 2/2 предов = 1 выговор, 3/3 выговоров = снятие.\n- kick (снят/снять/skick/gban) - снимает модератора.\n- unwarn (unvig/анварн/анвыг/унвыг/унварн) - снимает указанный тип наказания модератору (выговор или предупреждение)\n- warn (выг/выговор) - выдает выговор модератору. 3/3 выговоров = снятие.\n- stats (статистика/стата) - посмотреть статистику пользователя по его нику/вк`],
            [ModeratorRank.DEPUTY, `- newmoderator (добавитьмодератора/new/новыймодератор/addmoder/модер) назначает на должность нового модератора.\n- setrank (сетранг/повысить/понизить) - устанавливает модератору определенный ранг (должность)`]
        ])

        const commands : string[] = [];

        for (const i of map) {
            if (sender.rank.weight >= i[0].weight) commands.push(i[1])
        }

        await message.reply(`Список доступных для <<${sender.rank.displayName}>> команд:\n\n${commands.join('\n')}`)

    }

}