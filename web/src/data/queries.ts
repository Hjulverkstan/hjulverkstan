import { QueryKey } from '@tanstack/react-query';

import { queryClient } from '@root';

//

const queryKeyToString = (queryKey: QueryKey) =>
  typeof queryKey === 'string'
    ? queryKey
    : queryKey.map((el) => JSON.stringify(el)).join();

export const invalidateQueries = (queryKeys: string[][]) => {
  queryClient
    .invalidateQueries({
      predicate: ({ queryKey = '' }) =>
        queryKeys.some((matchQueryKey) =>
          queryKeyToString(queryKey).startsWith(
            queryKeyToString(matchQueryKey),
          ),
        ),
    })
    .catch((err) => {
      throw Error('invalidateQueries failed, error: ' + err);
    });
};
