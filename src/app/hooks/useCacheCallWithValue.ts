import { useCacheCall } from './useCacheCall';
import { useEffect, useState } from 'react';

export function useCacheCallWithValue(
  contractName: string,
  methodName: string,
  defaultValue: string | any = '0',
  ...args: any
) {
  const { value, loading, error } = useCacheCall(
    contractName,
    methodName,
    ...args,
  );

  const [fixedValue, setFixedValue] = useState(
    value !== null ? value : defaultValue,
  );

  useEffect(() => {
    setFixedValue(value !== null ? value : defaultValue);
  }, [value, defaultValue]);

  return { value: fixedValue, loading, error };
}
