import { Context, useContext } from 'react';

export default function useStrictContext<Value>(ctx: Context<Value>) {
  const value = useContext(ctx);

  if (value === null) {
    throw new Error(
      `${ctx.displayName ?? 'Unknown context'} was called outside of its provider`,
    );
  }

  return value;
}
