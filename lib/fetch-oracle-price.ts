import { PriceServiceConnection } from '@pythnetwork/price-service-client';

const PYTH_SOL_USD_FEED_ID = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

export async function fetchSolPrice(): Promise<number> {
  try {
    const connection = new PriceServiceConnection('https://hermes.pyth.network');
    
    const priceFeeds = await connection.getLatestPriceFeeds([PYTH_SOL_USD_FEED_ID]);
    
    if (priceFeeds && priceFeeds.length > 0) {
      const priceFeed = priceFeeds[0];
      const price = priceFeed.getPriceNoOlderThan(60);
      
      if (price) {
        const solPrice = Number(price.price) * Math.pow(10, price.expo);
        return solPrice;
      }
    }
    
    return 132; // fallback
  } catch (error) {
    console.error('Error fetching SOL price from Pyth:', error);
    return 132;
  }
}
