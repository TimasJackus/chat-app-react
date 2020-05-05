import React, { useState, useCallback, useMemo } from "react";
import { IMessage } from "../../types/interfaces/Message";
import { SidebarUpdateContext } from "./UpdateContext";
import { SidebarContext } from "./Context";

export const SidebarProvider: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedThread, setSelectedThread] = useState<IMessage | null>(null);

    const close = useCallback(() => {
        setSelectedThread(null);
        setIsOpen(false);
    }, [setIsOpen]);

    const selectThread = useCallback(
        (message: IMessage) => {
            setSelectedThread(message);
            setIsOpen(true);
        },
        [setSelectedThread, setIsOpen]
    );

    const updateValue = useMemo(() => ({ close, selectThread }), [
        close,
        selectThread,
    ]);

    const value = useMemo(() => ({ isOpen, selectedThread }), [
        isOpen,
        selectedThread,
    ]);

    return (
        <SidebarUpdateContext.Provider value={updateValue}>
            <SidebarContext.Provider value={value}>
                {children}
            </SidebarContext.Provider>
        </SidebarUpdateContext.Provider>
    );
};
