import { IUser } from "../IUser";

export interface IMessage {
    id: string;
    sender: IUser;
    content: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    replyCount: number;
    type: string;
    pinned: boolean;
}
