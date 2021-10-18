import React, { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import styles from '../../index.module.scss';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';
import { getContract } from 'utils/blockchain/contract-helpers';
import { FeesEarnedClaimForm } from '../ClaimForms/FeesEarnedClaimForm/index';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { bignumber } from 'mathjs';
import { PieChart } from '../../styled';
import { Asset } from 'types';
import imgNoClaim from 'assets/images/reward/ARMANDO__LENDING.svg';
import { NoRewardInfo } from '../NoRewardInfo';
import { AssetRenderer } from 'app/components/AssetRenderer';

interface IFeesEarnedTabProps {
  amountToClaim: string;
}

export const FeesEarnedTab: React.FC<IFeesEarnedTabProps> = ({
  amountToClaim,
}) => {
  const { t } = useTranslation();

  const { events: feesEarnedEvents } = useGetContractPastEvents(
    'feeSharingProxy',
    'UserFeeWithdrawn',
  );

  const totalRewardsEarned = useMemo(
    () =>
      feesEarnedEvents
        .filter(
          item =>
            item.returnValues.token === getContract('RBTC_lending').address,
        )
        .map(item => item.returnValues.amount)
        .reduce(
          (prevValue, curValue) => prevValue.add(curValue),
          bignumber(amountToClaim),
        ),
    [amountToClaim, feesEarnedEvents],
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <div className={styles['tab-main-section']}>
        {bignumber(amountToClaim).equals(0) ? (
          <NoRewardInfo image={imgNoClaim} text={<NoRewardInfoText />} />
        ) : (
          <>
            <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
              <FeesEarnedClaimForm amountToClaim={amountToClaim} />
            </div>
            <div className={styles.divider} />
            <div className="tw-w-1/2">
              <div className="tw-flex tw-items-center tw-justify-evenly">
                <PieChart
                  firstPercentage={0}
                  secondPercentage={0}
                  thirdPercentage={100}
                />
                <div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-primary"></div>
                    100% {t(translations.rewardPage.fee.stakingFee)}
                  </div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-white"></div>
                    0% {t(translations.rewardPage.referralReward)} [
                    {t(translations.rewardPage.comingSoon)}]
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="tw-w-full tw-flex tw-flex-row tw-justify-center tw-gap-x-4 tw-items-center tw-mt-8">
        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.fee.stakingFee)}
          availableAmount={amountToClaim}
          totalEarnedAmount={totalRewardsEarned}
          asset={Asset.RBTC}
        />
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.referralReward)}
          availableAmount={0}
          totalEarnedAmount={0}
          asset={Asset.RBTC}
          isComingSoon
        />
      </div>
    </div>
  );
};

const NoRewardInfoText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-text-xl tw-font-medium tw-mb-5 tw-tracking-normal">
        <Trans
          i18nKey={translations.rewardPage.noRewardInfoText.feesEarnedTab.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className="tw-text-xs tw-tracking-normal tw-font-light tw-mb-5">
        <Trans
          i18nKey={
            translations.rewardPage.noRewardInfoText.feesEarnedTab
              .recommendationsTitle
          }
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className="tw-text-sm">
        <div className={styles.ul}>
          {t(
            translations.rewardPage.noRewardInfoText.feesEarnedTab
              .recommendation1,
          )}
        </div>
      </div>
    </>
  );
};
