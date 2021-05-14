/**
 *
 * ClaimForm
 *
 */

import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { contractReader } from 'utils/sovryn/contract-reader';

interface Item {}

interface Props {
  className?: object;
  address: string;
}
export function ClaimForm({ className, address }: Props) {
  const { t } = useTranslation();
  const [lockedBalance, setLockedBalance] = useState('');

  useEffect(() => {
    if (address) {
      contractReader
        .call('lockedSov', 'getLockedBalance', [address])
        .then(info => {
          setLockedBalance(`${info}`);
        });
    }
  }, [address]);

  return (
    <div
      className={cn(
        className,
        'tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0',
      )}
    >
      <div className="text-center tw-text-xl">
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-mt-6">
        <div className="tw-text-sm tw-mb-1">
          {t(translations.rewardPage.claimForm.availble)}
        </div>
        <Input
          value={lockedBalance}
          readOnly={true}
          appendElem={<AssetRenderer asset={Asset.SOV} />}
        />
        <Button
          className="tw-w-full tw-mt-10"
          text={t(translations.rewardPage.claimForm.cta)}
        />

        <div className="tw-text-xs tw-mt-4">
          {t(translations.rewardPage.claimForm.note) + ' '}
          <a href="/">{t(translations.rewardPage.claimForm.learn)}</a>
        </div>
      </div>
    </div>
  );
}
