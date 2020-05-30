import React, { useState, useCallback, useMemo } from "react";
import { IMessage } from "../../types/interfaces/Message";
import { SidebarUpdateContext } from "./UpdateContext";
import { SidebarContext } from "./Context";

export const SidebarProvider: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedThread, setSelectedThread] = useState<IMessage | null>(null);
    const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(
        false
    );

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

    const openPinnedMessages = useCallback(() => {
        setShowPinnedMessages(true);
        setIsOpen(true);
    }, [setShowPinnedMessages, setIsOpen]);

    const updateValue = useMemo(
        () => ({ close, selectThread, openPinnedMessages }),
        [close, selectThread, openPinnedMessages]
    );

    const value = useMemo(
        () => ({ isOpen, selectedThread, showPinnedMessages }),
        [isOpen, selectedThread, showPinnedMessages]
    );

    return (
        <SidebarUpdateContext.Provider value={updateValue}>
            <SidebarContext.Provider value={value}>
                {children}
            </SidebarContext.Provider>
        </SidebarUpdateContext.Provider>
    );
};
