import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Asset, Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { calculateAssetValue } from 'utils/helpers';
import { bignumber } from 'mathjs';
import { contractReader } from 'utils/sovryn/contract-reader';
export interface IEarnedFee {
  asset: Asset;
  contractAddress: string;
  value: string;
  rbtcValue: number;
}

export const useGetFeesEarnedClaimAmount = () => {
  const { assetRates, assetRatesLoading, assetRatesLoaded } = useSelector(
    selectWalletProvider,
  );

  const { loading, earnedFees } = useGetFeesEarned();

  const calculatedFees = useMemo(
    () =>
      earnedFees.map(fee => ({
        ...fee,
        rbtcValue: calculateAssetValue(
          fee.asset,
          fee.value,
          Asset.RBTC,
          assetRates,
        ),
      })),

    [earnedFees, assetRates],
  );

  const totalAmount = useMemo(
    () =>
      calculatedFees.reduce(
        (prevValue, curValue) => prevValue.add(curValue.rbtcValue),
        bignumber(0),
      ),
    [calculatedFees],
  );
  return {
    loading: loading || (assetRatesLoading && !assetRatesLoaded),
    earnedFees: calculatedFees,
    totalAmount,
  };
};

const useGetFeesEarned = () => {
  const address = useAccount();
  const blockSync = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [RBTCDummyAddress, setRBTCDummyAddress] = useState(
    '0xeabd29be3c3187500df86a2613c6470e12f2d77d',
  );

  useEffect(() => {
    const getRbtcDummyAddress = async () => {
      contractReader
        .call<string>(
          'feeSharingProxy',
          'RBTC_DUMMY_ADDRESS_FOR_CHECKPOINT',
          [],
        )
        .then(result => setRBTCDummyAddress(result));
    };

    getRbtcDummyAddress().then();
  }, []);

  const defaultEarnedFees: IEarnedFee[] = useMemo(
    () => [
      {
        asset: Asset.RBTC,
        contractAddress: RBTCDummyAddress,
        value: '0',
        rbtcValue: 0,
      },
      {
        asset: Asset.SOV,
        contractAddress: getContract('SOV_token').address,
        value: '0',
        rbtcValue: 0,
      },
      {
        asset: Asset.MYNT,
        contractAddress: getContract('MYNT_token').address,
        value: '0',
        rbtcValue: 0,
      },
      {
        asset: Asset.ZUSD,
        contractAddress: getContract('ZUSD_token').address,
        value: '0',
        rbtcValue: 0,
      },
    ],
    [RBTCDummyAddress],
  );

  const [earnedFees, setEarnedFees] = useState(defaultEarnedFees);
  const feeSharingProxyContract = getContract('feeSharingProxy');

  const getAvailableFees = useCallback(() => {
    const callData = earnedFees.map(fee => ({
      address: feeSharingProxyContract.address,
      abi: feeSharingProxyContract.abi,
      fnName:
        fee.asset === Asset.RBTC
          ? 'getAccumulatedRBTCFeeBalances'
          : 'getAccumulatedFees',
      args:
        fee.asset === Asset.RBTC ? [address] : [address, fee.contractAddress],
      key: fee.asset,
      parser: value => value[0].toString(),
    }));

    setLoading(true);
    bridgeNetwork
      .multiCall(Chain.RSK, callData)
      .then(result => {
        if (result.returnData) {
          const fees = earnedFees.map(fee => ({
            ...fee,
            value: result.returnData[fee.asset] || '',
          }));
          setEarnedFees(fees);
        }
      })
      .catch(error => {
        console.error('e', error);
      })
      .finally(() => setLoading(false));
  }, [
    address,
    earnedFees,
    feeSharingProxyContract.abi,
    feeSharingProxyContract.address,
  ]);

  useEffect(() => {
    if (address) {
      getAvailableFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, blockSync]);

  return {
    loading,
    earnedFees,
  };
};
