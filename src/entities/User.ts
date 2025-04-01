import {Badge} from "@/entities/enums/Badge";

export interface User {
    lastActivity: Date,
    nbJobCompleted: bigint,
    badgeLevel: Badge,
    isRegistered: boolean,
}