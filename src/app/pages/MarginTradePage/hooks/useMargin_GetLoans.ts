import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAccount } from 'app/hooks/useAccount';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { useDebug } from 'app/hooks/useDebug';
import {
  LoanData,
  LoanEvent,
} from '../components/OpenPositionsTable/hooks/useMargin_getLoanEvents';

const PAGE_SIZE = 6;

type ClosedPositionHookResult = {
  loading: boolean;
  events?: LoanData[];
  totalCount: number;
};

export const useMargin_GetLoans = (
  page: number,
  isOpen: boolean,
): ClosedPositionHookResult => {
  const { log, error } = useDebug('useMargin_GetLoans');
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [totalCount, setTotalCount] = useState(0);
  const [events, setEvents] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getOpenLoans = () =>
      axios
        .get(
          url +
            `/events/trade/${account}?page=${page}&pageSize=${PAGE_SIZE}&isOpen=${isOpen}`,
        )
        .then(({ data }) => {
          log(data.events);
          const sortedEntries = data.events.sort(
            (a: LoanEvent, b: LoanEvent) => {
              return b.time - a.time;
            },
          );
          setEvents(sortedEntries);
          setTotalCount(data.pagination.totalPages * PAGE_SIZE);
          setLoading(false);
        })
        .catch(e => {
          error(e);
          setLoading(false);
        });

    if (account) {
      getOpenLoans();
    }
  }, [account, page, isOpen, url, log, error]);

  return {
    events,
    loading,
    totalCount,
  };
};
