import type {OpenPosition, ClosedPosition, User} from "@repo/types";
import { prisma } from "@repo/database";
import { redis } from "@repo/cache"

export let lastEngineFeedId = "0"; // for redis purpose only.
export let users: User[]  = [];
export let openPositions: OpenPosition[] = [];
export let closedPositions: ClosedPosition[] = [];

export let symbolToSpread: Map<string, {bid: number, ask: number}> = new Map();
export let symbols: Array<string> = [];
export let symbolToDecimal: Map<string, number> = new Map();


export function setLastEngineFeedId(id: string){
    lastEngineFeedId = id;
}

async function initializeStateFromDb(){
    const symbolAndDecimals = (await prisma.asset.findMany({
        select: {
            symbol: true,
            decimals: true
        },
    }));

    symbols = symbolAndDecimals.map(({symbol})=>symbol);
    symbolToDecimal = new Map(symbolAndDecimals.map(({symbol, decimals})=>[symbol, decimals]));
}

async function snapshotStateToCache(){
    const multi = redis.multi(); // for automic transactions

    // snapshot state to cache.
    multi.set("engineState:lastEngineFeedId", lastEngineFeedId);
    multi.set("engineState:users", JSON.stringify(users));
    multi.set("engineState:openPositions", JSON.stringify(openPositions));
    multi.set("engineState:closedPositions", JSON.stringify(closedPositions));
    multi.set("engineState:symbolToSpread", JSON.stringify(Array.from(symbolToSpread)));

    // trim stream before lastEngineFeedId
    multi.xTrim("engine-feed", "MINID", lastEngineFeedId);

    await multi.exec();
}

async function snapshotStateToDB(){
    prisma 
}

async function initializeStateFromCache(){
    lastEngineFeedId = await redis.get("engineState:lastEngineFeedId") ?? "0";
    const usersSerialized = await redis.get("engineState:users");
    const openPositionsSerialized = await redis.get("engineState:openPositions");
    const closedPositionsSerialized = await redis.get("engineState:closedPositions");
    const symbolToSpreadSerialized = await redis.get("engineState:symbolToSpread");

    // populate state.
    if(usersSerialized){
        users = JSON.parse(usersSerialized);
    }
    if(openPositionsSerialized){
        openPositions = JSON.parse(openPositionsSerialized);
    }
    if(closedPositionsSerialized){
        closedPositions = JSON.parse(closedPositionsSerialized);
    }
    if(symbolToSpreadSerialized){
        symbolToSpread = new Map(JSON.parse(symbolToSpreadSerialized));
    }
}

export async function initializeEngineState(){
    await initializeStateFromDb();
    await initializeStateFromCache();
}