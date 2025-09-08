import "dotenv/config";
import { prisma } from "@repo/database";

// let x = 11;
// export default x

const symbolAndDecimals = (await prisma.asset.findMany({
  select: {
    symbol: true,
    decimals: true
  },
}));

export const symbols = symbolAndDecimals.map(({symbol})=>symbol);
export const symbolToDecimal = new Map(symbolAndDecimals.map(({symbol, decimals})=>[symbol, decimals]));