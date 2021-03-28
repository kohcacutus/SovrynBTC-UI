/**
 *
 * AssetWalletBalance
 *
 */
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types/asset';
import { weiTo18, weiToFixed } from 'utils/blockchain/math-helpers';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { LoadableValue } from '../LoadableValue';
import { Sovryn } from '../../../utils/sovryn';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function AssetWalletBalance(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const { t } = useTranslation();
  const connected = useIsConnected();

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value]);

  const doConnect = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="font-weight-bold text-muted mb-2">
        {t(translations.assetWalletBalance.accountBalance)}
      </div>
      {!connected && (
        <button
          onClick={doConnect}
          className="bg-transparent btn-link text-white border-0 d-block text-left text-nowrap"
        >
          {t(translations.assetWalletBalance.connect)}
        </button>
      )}
      {connected && (
        <div className="d-flex flex-row justify-content-start align-items-center">
          <span className="text-muted">{props.asset}</span>
          <span className="text-white font-weight-bold ml-2">
            <LoadableValue
              value={weiToFixed(value, 4)}
              loading={loading}
              tooltip={<>{weiTo18(value)}</>}
            />
          </span>
        </div>
      )}
    </div>
  );
}
