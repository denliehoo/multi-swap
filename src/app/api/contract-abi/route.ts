import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// TODO: Change the APIs for this after Migrating away from ftm + goerli => sepolia
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain');
  const address = searchParams.get('address');

  if (!chain || !address) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 },
    );
  }

  let res;
  if (chain === 'goerli') {
    res = await axios.get(
      `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    );
  } else if (chain === 'ftm') {
    res = await axios.get(
      `https://api.ftmscan.com/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_FTMSCAN_API_KEY}`,
    );
  }

  // if status !== 200, likely means contract not verified

  let response = res?.status === 200 ? JSON.parse(res.data.result) : null;

  return NextResponse.json(response, {
    status: response ? 200 : 404,
  });
}
