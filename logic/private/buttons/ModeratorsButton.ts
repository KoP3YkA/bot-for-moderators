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

@PrivateButtonRouting('moderators')
@OnlyBasicStaff(ModeratorRank.CURATOR)
export class ModeratorsButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const basicModerators = await ModeratorsModule.select({moderatorType: ModeratorType.BASIC.tag}, {order: 'id', limit: 10})
        const panelModerators = await ModeratorsModule.select({moderatorType: ModeratorType.PANEL.tag}, {order: 'id', limit: 40})
        const basic : string[] = []
        const panel : string[] = []

        let count = 0;
        for (const i of basicModerators) {
            if (i.userId === message.sender.userId) continue;
            count++;
            basic.push(`${count}) ${await new User(i.userId).getMention(NameCase.NOM)} — ${ModeratorRank.findByTag(i.rang).displayName}`)
        }

        count = 0;
        for (const i of panelModerators) {
            count++;
            panel.push(`${count}) ${await new User(i.userId).getMention(NameCase.NOM)} — ${PanelModeratorRank.findByTag(i.rang).displayName}`)
        }

        if (basic.length < 1) basic.push('Модераторов из основного состава нет!')
        if (panel.length < 1) panel.push('Модераторов из состава МБИ нет!')

        await message.editMessage({
            message: `
Состав модерации.
Основной состав модерации (макс. 40)
${basic.join('\n')}

Состав МБИ | панели (макс. 10)
${panel.join('\n')}
            `
        }, {
            title: 'Ваша статистика',
            color: Color.BLUE,
            payload: {command: 'statistic', user: message.sender.userId}
        })

    }

}