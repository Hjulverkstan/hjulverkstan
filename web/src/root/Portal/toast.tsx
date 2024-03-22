import * as Toast from '@components/ui/Toast';

export const createErrorToast = ({
  verbLabel,
  dataLabel,
}: {
  verbLabel: string;
  dataLabel: string;
}) => ({
  variant: 'destructive' as any,
  title: `Failed to ${verbLabel} the ${dataLabel}.`,
  description: 'Try again soon or contact your local developer.',
  duration: 5000,
});

export const createSuccessToast = ({
  verbLabel,
  dataLabel,
  id,
}: {
  verbLabel: string;
  dataLabel: string;
  id?: string;
}) => ({
  variant: 'success' as any,
  title: `Successfully managed to ${verbLabel} the ${dataLabel}${id ? ` with id: ${id}` : ''}.`,
  duration: 5000,
});

export const createRefreshToast = (cb: () => void) => ({
  title: 'Someone has made changes to the data you are viewing.',
  description: 'Do you want to refresh?',
  duration: 1000000,
  action: (
    <Toast.Action altText="Yes" onClick={cb}>
      Yes
    </Toast.Action>
  ),
});
