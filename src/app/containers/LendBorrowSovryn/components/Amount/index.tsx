import React, { ChangeEvent, useState } from 'react';

import '../../assets/index.scss';
import clsx from 'clsx';

type Props = {
  amountName: string;
  currency: string;
  minValue: number | string;
  maxValue: number | string;
};

const Amount: React.FC<Props> = ({
  amountName,
  currency,
  minValue,
  maxValue,
}) => {
  const [value, currentValue] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    currentValue(e.target.value as string);
  return (
    <div
      className={clsx(
        'amount-container',
        currency === 'DOC' && 'amount-container__green',
      )}
    >
      <div className="d-flex flex-column ">
        <p> {amountName}</p>
        <div className="d-flex input-container">
          <div className="flex-grow-1 data-container">
            <input
              type="number"
              className="d-inline-block w-100-input"
              value={value}
              placeholder="Enter amount"
              onChange={onChange}
            />
          </div>
          <div className=" mr-2 d-flex align-items-center">
            <b>MAX</b>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column min-max-btc">
        <p>
          <span>Min:</span> {currency} <strong>{minValue}</strong>
        </p>
        <p>
          <span>Max:</span> {currency} <strong>{maxValue}</strong>
        </p>
      </div>
    </div>
  );
};

export default Amount;
