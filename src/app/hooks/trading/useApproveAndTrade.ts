import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useCallback } from 'react';
import { useMarginTrade } from './useMarginTrade';
import { useAccount } from '../useAccount';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';

export function useApproveAndTrade(
  lendingContract: Asset,
  token: Asset,
  leverage: number,
  collateralTokenSent: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const getToken = useCallback(() => {
    if (lendingContract === token) {
      return AssetsDictionary.get(lendingContract).primaryCollateralAsset;
    }
    return token;
  }, [lendingContract, token]);

  const account = useAccount();

  const { trade, ...rest } = useMarginTrade(
    lendingContract,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    lendingContract === token ? collateralTokenSent : '0',
    lendingContract === token ? '0' : collateralTokenSent,
    getToken(),
    account, // trader
    '0x',
    token === Asset.BTC ? collateralTokenSent : '0',
  );

  return {
    trade: async () => {
      let tx: CheckAndApproveResult = {};
      if (token !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          token,
          getLendingContract(lendingContract).address,
          collateralTokenSent,
          // toWei('1000000', 'ether'),
        );
        if (tx.rejected) {
          return;
        }
      }
      await trade(tx?.nonce, tx?.approveTx);
    },
    ...rest,
  };
}
