"use client";
import { Currency } from "@/types/enum";
import React, { useState } from "react";


interface ICurrency {
    currency: Currency
    setCurrency: (currency: Currency) => void
}


const CurrencyContext = React.createContext<ICurrency | null>(null)

export const useCurrency = () => {
    const currencyContext = React.useContext(CurrencyContext)
    if (!currencyContext) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return currencyContext
}

function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState(Currency.NGN)

    const updateCurrency = (update: Currency) => {
        setCurrency(update)
    }

    const value = {
        currency,
        setCurrency: updateCurrency
    }
    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    )
}

export default CurrencyProvider