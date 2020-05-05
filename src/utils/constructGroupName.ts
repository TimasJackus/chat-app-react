import { IUser } from "../types/interfaces";

const truncate = (input: string, length: number = 25) => {
    if (input.length > length) {
        return input.substring(0, length) + "...";
    } else {
        return input;
    }
};

export const constructGroupName = (
    members: IUser[],
    trunc: boolean = false
) => {
    const name = members.map((m) => m.displayName).join(", ");
    return trunc ? truncate(name) : name;
};
