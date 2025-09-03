import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// TODO: Make the API more robust. Currently we are always assuming native (0x0000...) is passed as the first element.
// However, if we implement infinite scrolling, this might be be the case
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain');
  const walletAddress = searchParams.get('walletAddress');
  const tokenAddressesParam = searchParams.get('tokenAddresses'); // comma-separated
  const tokenAddresses = tokenAddressesParam?.split(',') || [];

  if (!chain || !walletAddress || tokenAddresses.length === 0) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 },
    );
  }

  try {
    const tokenBalances: number[] = [];

    // Get native balance
    const nativeBalanceRes = await axios.get(
      `https://deep-index.moralis.io/api/v2/${walletAddress}/balance`,
      {
        params: { chain },
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
        },
      },
    );

    tokenBalances.push(
      Number.parseFloat(nativeBalanceRes.data.balance) / 10 ** 18,
    );

    tokenAddresses.splice(0, 1); // Remove first element which is address native

    // Get ERC20 token balances
    const erc20Res = await axios.get(
      `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20`,
      {
        params: {
          chain,
          token_addresses: tokenAddresses,
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
        },
      },
    );

    const rawBalances = erc20Res.data;

    for (const tokenAddress of tokenAddresses) {
      const found = rawBalances.find(
        (r: { token_address: string }) =>
          r.token_address.toLowerCase() === tokenAddress.toLowerCase(),
      );

      if (found) {
        tokenBalances.push(
          Number.parseFloat(found.balance) / 10 ** found.decimals,
        );
      } else {
        tokenBalances.push(0);
      }
    }

    return NextResponse.json({ balances: tokenBalances });
  } catch (error) {
    console.error('Failed to fetch token balances:', error);
    return NextResponse.json(
      { error: `Failed to fetch balances:${JSON.stringify(error)}` },
      { status: 500 },
    );
  }
}

// BOO: 0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE
// USDC: 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
// LQDR: 0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9
// LQDR, BOO, USDC:
// [0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9,0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE,0x04068DA6C83AFCFA0e13ba15A6696662335D5B75]
// should take it the token address and return the user balances in that order. Dont forget to add in the native balance also
