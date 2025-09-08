import {redis} from "@repo/cache";
import type {EngineFeed} from "@repo/types";
import { initializeEngineState, lastEngineFeedId, setLastEngineFeedId } from "./state";


async function engineFeedListener(cb: (feed: EngineFeed)=>void){
    while(true){
        const feedData = await redis.xRead({key: "engine-feed", id: lastEngineFeedId}, {COUNT: 1, BLOCK: 0}) as any;
        setLastEngineFeedId(feedData[0].messages[0].id);
        const feed: EngineFeed = feedData[0].messages[0].message;
        cb(feed);
    }
}

async function initializeEngine(){
    await initializeEngineState();
    
}