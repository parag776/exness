import "dotenv/config";
import { prisma } from "@repo/database";

// let x = 11;
// export default x

export default (await prisma.asset.findMany({
  select: {
    symbol: true,
  },
})).map(({symbol}: {symbol: String})=> symbol);
