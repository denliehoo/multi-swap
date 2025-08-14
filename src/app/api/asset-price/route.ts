import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain');
  const asset = searchParams.get('asset');
  const address = searchParams.get('address');

  if (!chain || !asset || !address) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 },
    );
  }

  let assetPrice = 0;

  try {
    if (asset === 'ETH') {
      // call eth price
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      );
      assetPrice = res.data.ethereum.usd;
    } else if (asset === 'FTM') {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd',
      );
      assetPrice = res.data.fantom.usd;
    } else {
      const res = await axios.get(
        `https://deep-index.moralis.io/api/v2/erc20/${address}/price`,
        {
          params: { chain: chain },
          headers: {
            accept: 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
          },
        },
      );
      assetPrice = res.data.usdPrice;
    }

    return new NextResponse(assetPrice.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Failed to fetch asset price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Prices:' + JSON.stringify(error) },
      { status: 500 },
    );
  }
}
