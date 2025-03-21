import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {OnlyBasicStaff} from "../../../core/annotations/routing/OnlyBasicStaff";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {ModeratorsModule} from "../../../core/classes/impl/database/modules/ModeratorsModule";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";
import {User} from "../../../core/classes/impl/entity/User";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {Color} from "../../../core/classes/impl/enums/Color";
import {ClientAPI} from "../../../core/classes/impl/app/ClientAPI";
import {Main} from "../../../Main";
import {Messages} from "../../../core/namespaces/Messages";

@PrivateButtonRouting('moderators')
@OnlyBasicStaff(ModeratorRank.CURATOR)
export class ModeratorsButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const allModerators = await ModeratorsModule.select({}, {order: 'id', limit: 60})
        const moderatorsMentions : Map<number, string> = await Main.getApi().getUserMentionsByIds(allModerators.map(obj => obj.userId))
        const basic : string[] = []
        const panel : string[] = []

        for (const i of allModerators) {
            if (i.userId === message.sender.userId && !moderatorsMentions.has(i.userId)) continue;
            if (i.moderatorType === ModeratorType.BASIC) {
                if (basic.length >= 40) continue;
                basic.push(`${basic.length+1}) ${moderatorsMentions.get(i.userId)} — ${ModeratorRank.findByTag(i.rang).displayName} | ${i.nickname}`)
            } else if (i.moderatorType === ModeratorType.PANEL) {
                if (panel.length >= 15) continue;
                panel.push(`${panel.length+1}) ${moderatorsMentions.get(i.userId)} — ${PanelModeratorRank.findByTag(i.rang).displayName} | ${i.nickname}`)
            }
        }

        if (basic.length < 1) basic.push('Модераторов из основного состава нет!')
        if (panel.length < 1) panel.push('Модераторов из состава МБИ нет!')

        await message.editMessage({
            message: `
Состав модерации.
Основной состав модерации (макс. 40)
${basic.join('\n')}

Состав МБИ | панели (макс. 15)
${panel.join('\n')}
            `
        }, Messages.TO_STATISTIC(message.sender.userId))

    }

}