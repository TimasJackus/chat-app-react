import { IUser } from "../IUser";

export interface IMessage {
    id: string;
    sender: IUser;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyCount: number;
}
