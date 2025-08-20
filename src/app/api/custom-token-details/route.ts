import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface ITokenData {
  name: string;
  symbol: string;
  decimals: string;
  logo: string;
  thumbnail: string;
  possible_spam: boolean;
  verified_contract: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain');
  const tokenAddress = searchParams.get('tokenAddress');

  if (!chain || !tokenAddress) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 },
    );
  }

  const apiRes = await axios.get(
    `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`,
    {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
      },
    },
  );

  const res: ITokenData | null = apiRes?.status === 200 ? apiRes.data : null;

  return NextResponse.json(res, {
    status: res ? 200 : 404,
  });
}
