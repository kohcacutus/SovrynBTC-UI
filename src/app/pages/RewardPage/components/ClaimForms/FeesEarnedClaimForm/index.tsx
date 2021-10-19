import React, { useCallback } from 'react';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { getContract } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { gasLimit } from 'utils/classifiers';

export const FeesEarnedClaimForm: React.FC<IClaimFormProps> = ({
  className,
  amountToClaim,
}) => {
  const address = useAccount();
  const { value: maxCheckpoints } = useCacheCallWithValue(
    'feeSharingProxy',
    'numTokenCheckpoints',
    100,
    getContract('RBTC_lending').address,
  );
  const { send, ...tx } = useSendContractTx('feeSharingProxy', 'withdraw');

  const onSubmit = useCallback(() => {
    send(
      [getContract('RBTC_lending').address, maxCheckpoints, address],
      { from: address, gas: gasLimit[TxType.STAKING_REWARDS_CLAIM] },
      { type: TxType.STAKING_REWARDS_CLAIM },
    );
  }, [address, maxCheckpoints, send]);

  return (
    <BaseClaimForm
      className={className}
      amountToClaim={amountToClaim}
      tx={tx}
      onSubmit={onSubmit}
      footer={<Footer />}
      claimAsset={Asset.RBTC}
    />
  );
};

const Footer: React.FC = () => (
  <>
    <Trans
      i18nKey={translations.rewardPage.feesEarnedClaimForm.note}
      components={[<AssetRenderer asset={Asset.RBTC} />]}
    />{' '}
    <a
      href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
      target="_blank"
      rel="noreferrer noopener"
      className="tw-text-secondary tw-underline"
    >
      <Trans i18nKey={translations.rewardPage.feesEarnedClaimForm.learn} />
    </a>
  </>
);
