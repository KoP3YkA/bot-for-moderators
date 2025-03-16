import {Rank} from "../../classes/impl/enums/Rank";
import {ReverseRouting} from "./ReverseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";
import {ModeratorRank} from "../../classes/impl/enums/ModeratorRank";

export const OnlyBasicStaff = (rank: ModeratorRank) => ReverseRouting(RoutingMaps.PRIVATE_MINIMAL_RANKS, rank);