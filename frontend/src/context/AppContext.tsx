import React, { useContext, useState } from "react";
import Message from "../components/Message";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type NotiMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext = { 
    showNoti: (notiMessage: NotiMessage) => void;
    isLoggedIn: boolean;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({children}: 
    { children: React.ReactNode}) => {
        const [notiMessage, setNotiMessage] = useState<NotiMessage | undefined>(undefined)

        const { isError } = useQuery("validateToken", apiClient.validateToken, {
            retry: false,
        })

        return (
            <AppContext.Provider value={{
                showNoti: (notiMessage) => {
                    setNotiMessage(notiMessage);
                },
                isLoggedIn: !isError
            }}>
                {notiMessage && (<Message 
                message={notiMessage.message} 
                type={notiMessage.type} 
                onClose={() => setNotiMessage(undefined)}/>)}
                {children}
            </AppContext.Provider>
        )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}