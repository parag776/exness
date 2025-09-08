export type Side = "BUY" | "SELL";

export type TradeCreate = {
    symbol: string,
    quantity: number,
    side: Side,
    leverage: number
}

export type User = {
    id: string,
    email: string,
    usd: number,
    margin: number,
}

export type OpenOrder = {
    id: string,
    userId: string,
    side: Side,
    symbol: string,
    leverage: number,
    price: number,
    quantity: number
}


