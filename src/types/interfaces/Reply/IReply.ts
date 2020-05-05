import { IUser } from "../IUser";

export interface IReply {
    id: string;
    sender: IUser;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyCount: number;
}
