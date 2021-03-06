export interface IUser {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    description?: string;
    imageUrl?: string;
    token: string;
    unreadCount: number;
}
