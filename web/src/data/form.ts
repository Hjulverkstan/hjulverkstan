import { z } from 'zod';

export const withErrMsg = (message: string) => ({
  errorMap: (issue: any) => ({ ...issue, message }),
});

export const isReq = (dataLabel: string) =>
  withErrMsg(`${dataLabel} is required.`);

export const reqString = (dataLabel: string) =>
  z.string(isReq(dataLabel)).min(1, { message: `${dataLabel} is required.` });
