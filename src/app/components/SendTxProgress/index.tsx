/**
 *
 * SendTxProgress
 *
 */
import React from 'react';
import { Icon } from '@blueprintjs/core';
import { TransactionStatus } from '../../../types/transaction-status';
import { LinkToExplorer } from '../LinkToExplorer';

interface Props {
  status: TransactionStatus;
  txHash: string;
  loading: boolean;
  type: string;
}

export function SendTxProgress(props: Props) {
  return (
    <>
      {props.status !== TransactionStatus.NONE}
      <div className="d-flex flex-row align-items-center">
        {(props.status === TransactionStatus.PENDING_FOR_USER ||
          props.status === TransactionStatus.PENDING) && <Icon icon="time" />}
        {props.status === TransactionStatus.SUCCESS && <Icon icon="tick" />}
        {props.status === TransactionStatus.ERROR && <Icon icon="error" />}
        {props.type && (
          <div className="d-inline ml-2 text-uppercase text-muted">
            {props.type}:
          </div>
        )}
        <div className="d-inline float-right text-align-right w-100 ml-2">
          {props.txHash && <LinkToExplorer txHash={props.txHash} />}
          {!props.txHash &&
            props.status === TransactionStatus.PENDING_FOR_USER && (
              <span className="text-right d-inline-block font-italic">
                Waiting for user interaction
              </span>
            )}
          {!props.txHash && props.status === TransactionStatus.ERROR && (
            <span className="text-right d-inline-block font-italic">
              Transaction denied.
            </span>
          )}
        </div>
      </div>
    </>
  );
}

SendTxProgress.defaultProps = {
  status: TransactionStatus.NONE,
  txHash: null,
  loading: false,
  type: null,
};
