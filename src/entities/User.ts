import {Badge} from "@/entities/enums/Badge";

export interface User {
    lastActivity: Date,
    nbJobCompleted: bigint,
    badgeLevel: Badge,
    isRegistered: boolean,
}

export const mapContractDataToUser = (data: readonly [bigint, bigint, bigint, boolean]): User => {
    return {
        lastActivity: new Date(Number(data[0]) * 1000),
        nbJobCompleted: data[1] as bigint,
        badgeLevel: Number(data[2]) as Badge,
        isRegistered: data[3] as boolean,
    };
};
