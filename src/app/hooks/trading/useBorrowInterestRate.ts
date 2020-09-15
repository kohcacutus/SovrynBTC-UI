import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useBorrowInterestRate(asset: Asset, weiAmount: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'nextBorrowInterestRate',
    '0',
    weiAmount,
  );
}
