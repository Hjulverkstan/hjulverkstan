import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

interface UseAggregatedQueryResult<Error, Data> {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  data?: Data;
}

// Overload

export function useAggregatedQueries<Error, D1, DSelect>(
  select: (d1: D1) => DSelect,
  queries: [UseQueryResult<D1, Error>],
): UseAggregatedQueryResult<Error, DSelect>;

export function useAggregatedQueries<Error, D1, D2, DSelect>(
  select: (d1: D1, d2: D2) => DSelect,
  queries: [UseQueryResult<D1, Error>, UseQueryResult<D2, Error>],
): UseAggregatedQueryResult<Error, DSelect>;

export function useAggregatedQueries<Error, D1, D2, D3, DSelect>(
  select: (d1: D1, d2: D2, d3: D3) => DSelect,
  queries: [
    UseQueryResult<D1, Error>,
    UseQueryResult<D2, Error>,
    UseQueryResult<D3, Error>,
  ],
): UseAggregatedQueryResult<Error, DSelect>;

export function useAggregatedQueries<Error, D1, D2, D3, D4, DSelect>(
  select: (d1: D1, d2: D2, d3: D3, d4: D4) => DSelect,
  queries: [
    UseQueryResult<D1, Error>,
    UseQueryResult<D2, Error>,
    UseQueryResult<D3, Error>,
    UseQueryResult<D4, Error>,
  ],
): UseAggregatedQueryResult<Error, DSelect>;

//

export function useAggregatedQueries<Error, DSelect>(
  select: (...args: any[]) => DSelect,
  queries: Array<UseQueryResult<any, Error>>,
): UseAggregatedQueryResult<Error, DSelect> {
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.isError)?.error;

  const data = useMemo(
    () =>
      !isError && !isLoading
        ? select(...queries.map((q) => q.data!))
        : undefined,
    queries,
  );

  return { isLoading, isError, error, data };
}
