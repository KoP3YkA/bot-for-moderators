import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {Session} from "../../../core/namespaces/Session";
import {Messages} from "../../../core/namespaces/Messages";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateButtonRouting('suggestions')
export class SuggestionsButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        Session.SUGGESTIONS.add(sender.userId);
        await message.editMessage({
            message: `❤️‍🔥 Предложения по улучшению\n\n✴️ Тут вы можете написать свою идею (для бота/направления модерации) или баг-репорт. Просто напишите любое сообщение (не прикрепляйте картинки или любые другие вложения). Чтобы отменить, нажмите на кнопку ниже!`
        }, {
            title: 'Отменить',
            color: Color.RED,
            payload: {command: 'cancel'}
        })
    }

}