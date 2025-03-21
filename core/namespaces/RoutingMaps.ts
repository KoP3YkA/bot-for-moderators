import {Rank} from "../classes/impl/enums/Rank";
import {ChatEvent} from "../enums/ChatEvent";
import {ModeratorRank} from "../classes/impl/enums/ModeratorRank";

export namespace RoutingMaps {

    export const CHAT_COMMANDS : Map<string, any> = new Map();
    export const COMMAND_ALIASES : Map<string, any> = new Map();
    export const CHAT_BUTTONS : Map<string, any> = new Map();
    export const BUTTON_MINIMAL_RANKS : Map<any, Rank> = new Map();
    export const CHAT_EVENTS : Map<ChatEvent, any> = new Map();
    export const PRIVATE_BUTTONS : Map<string, any> = new Map();
    export const PRIVATE_MINIMAL_RANKS : Map<any, ModeratorRank> = new Map();
    export const PRIVATE_COMMANDS : Map<string, any> = new Map();
    export const ADMIN_COMMANDS : Set<any> = new Set();
    export const PRODUCTS_EXECUTORS : Map<string, any> = new Map();

}