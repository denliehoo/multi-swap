import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTokenBalances } from '@src/api';

export const useTokenBalances = (
  chain: string,
  walletAddress: string,
  tokenAddresses: string[],
) => {
  console.log('useTokenBalances called');
  return useQuery({
    queryKey: ['tokenBalances', chain, walletAddress, tokenAddresses],
    queryFn: () => getTokenBalances(chain, walletAddress, tokenAddresses),
    enabled: !!chain && !!walletAddress && tokenAddresses.length > 0,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 1 * 60 * 1000,
    retry: 1,
  });
};

export const useClearTokenBalancesCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: ['tokenBalances'] }),
    remove: () => queryClient.removeQueries({ queryKey: ['tokenBalances'] }),
  };
};
