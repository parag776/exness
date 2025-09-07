import {prisma} from "./client"

async function main(){
  await prisma.asset.createMany({
    data: [
      {
        symbol: "SOL",
        imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=040",
        name: "solana",
        decimals: 2
      },
      {
        symbol: "BTC",
        imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040",
        name: "bitcoin",
        decimals: 4
      },
      {
        symbol: "ETH",
        imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040",
        name: "ethereum",
        decimals: 4
      }
    ]})
}

main().then(()=>{
  console.log("seeded successfully");
}).catch((e)=>{
  console.log(e);
})

