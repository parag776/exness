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

export type OpenPosition = {
    id: string,
    userId: string,
    side: Side,
    symbol: string,
    leverage: number,
    price: number,
    quantity: number
}

export type ClosedPosition = {
    id: string,
    userId: string,
    side: Side,
    symbol: string,
    leverage: number,
    openPrice: number,
    closedPrice: number,
    pnl: number,
    liquidated: boolean,
    createdAt: Date
}

export type EngineFeed = {
    type: "spread",
    symbol: string,
    bid: string,
    ask: string,
} | {
    type: "spread",
    symbol: string,
    quantity: string,
    side: Side,
    leverage: string,
}