export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

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

export type EngineFeed = Prettify<{
    type: "spread",
    symbol: string,
    bid: number,
    ask: number,
} | ({
    type: "trade",
} & TradeCreate)>