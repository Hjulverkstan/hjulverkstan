export const withErrMsg = (message: string) => ({
  errorMap: (issue: any) => ({ ...issue, message }),
});

export const isReq = (dataLabel: string) =>
  withErrMsg(`${dataLabel} is required.`);
