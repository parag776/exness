import { catchedPrices, initialize_price_fetching } from "./fetch_price";
import { redis } from "@repo/cache"
import {symbolToDecimal} from "./symbols";
import type {EngineFeed} from "@repo/types";

initialize_price_fetching();

setInterval(()=>{
    for(let  [key, value] of catchedPrices){
        if(value) {
            let feed: EngineFeed = {type: "spread", 
                symbol: key, 
                bid: (value*0.99).toFixed(symbolToDecimal.get(key)),
                ask: (value*1.01).toFixed(symbolToDecimal.get(key))
            }
            redis.xAdd(`engine-feed`,"*", feed);
        }
    }
}, 100);