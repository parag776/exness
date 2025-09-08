import { WebSocket } from "ws";
import "dotenv/config"
import {symbols} from "./symbols";


const subscriptionParams = symbols.map((symbol)=>{
    return `bookTicker.${symbol}_USDC_PERP`;
});
const subscriptionObj = {method:"SUBSCRIBE",params: subscriptionParams,"id":2}	
// price catched
export const catchedPrices: Map<string,number> = new Map(symbols.map((symbol) => [symbol, 0]));

type WsPriceData = {
    stream: string,
    data: {
        b: string,
    }
}

// websocket
export function initialize_price_fetching(){
    const ws = new WebSocket(process.env.MARKET_FEED_URI ?? "wss://ws.backpack.exchange/")
    ws.on("open", ()=>{
        console.log("started market data feed.");
        ws.send(JSON.stringify(subscriptionObj));
    });

    ws.on("message", (message)=>{
        const data: WsPriceData = JSON.parse(message.toString());
        const symbol = data.stream.slice(11, 14);
        catchedPrices.set(symbol, parseFloat(data.data.b));
    })
}