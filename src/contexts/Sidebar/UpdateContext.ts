import { IMessage } from "../../types/interfaces/Message";
import { createContext } from "react";

interface ISidebarUpdateContext {
    close: () => void;
    openPinnedMessages: () => void;
    selectThread: (message: IMessage) => void;
}

export const SidebarUpdateContext = createContext<ISidebarUpdateContext>({
    close: () => {},
    selectThread: () => {},
    openPinnedMessages: () => {},
});
