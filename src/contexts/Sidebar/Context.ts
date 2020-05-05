import { IMessage } from "../../types/interfaces/Message";
import { createContext } from "react";

interface ISidebarContext {
    isOpen: boolean;
    selectedThread: IMessage | null;
}

export const SidebarContext = createContext<ISidebarContext>({
    isOpen: false,
    selectedThread: null,
});
