/**
 *
 * LeverageSelector
 *
 */
import React, { useEffect } from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  position: string;
}

export function LeverageSelector(props: Props) {
  const items = Array.from(
    Array(props.max + 1 - props.min),
    (_, i) => i + props.min,
  );

  // In case active leverage becomes unavailable, set leverage to first available.
  useEffect(() => {
    if (!items.includes(props.value)) {
      props.onChange(items[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <ButtonGroup className="leverage-selector-group">
      {items.map(item => (
        <Button
          className={`leverage-selector-group__button--${props.position}`}
          key={item}
          text={`${item}x`}
          active={item === props.value}
          onClick={() => props.onChange(item)}
        />
      ))}
    </ButtonGroup>
  );
}

LeverageSelector.defaultProps = {
  min: 1,
  max: 5,
  value: 1,
  onChange: (value: number) => {},
};
