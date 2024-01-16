import React, { useContext, useState } from "react";
import Message from "../components/Message";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""

type NotiMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext = { 
    showNoti: (notiMessage: NotiMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);


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
                isLoggedIn: !isError,
                stripePromise
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