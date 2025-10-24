import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Save, XIcon } from 'lucide-react';
import { ReactNode } from 'react';

import * as Tooltip from '@components/shadcn/Tooltip';
import { ErrorRes, StandardError } from '@data/api';
import { Mode, useDataForm } from '@components/DataForm';
import { Button, IconButton } from '@components/shadcn/Button';
import { useToast } from '@components/shadcn/use-toast';
import Error from '@components/Error';

import { createErrorToast, createSuccessToast } from './toast';

export interface PortalFormProps {
  /* Optionally tranform the body on submit before passed to mutate function */
  transformBodyOnSubmit?: (input: any) => any;
  isSubmitting: boolean;
  /* mutateAsync from useMutation() */
  createMutation: (body: any) => Promise<any>;
  /* mutateAsync from useMutation() */
  saveMutation: (body: any) => Promise<any>;
  error?: ErrorRes | StandardError | null;
  dataLabel: string;
  toToolbarName: (body: any) => string | undefined | false;
  children: ReactNode;
  /* Disables editing of the form. If a string is provided, it shows a tooltip
  message explaining why editing is disabled. */
  disableEdit?: string | false;
}

export default function PortalForm({
  isSubmitting,
  createMutation,
  saveMutation,
  error,
  children,
  dataLabel,
  toToolbarName,
  transformBodyOnSubmit = (x) => x,
  disableEdit,
}: PortalFormProps) {
  const { id = '' } = useParams();
  const { mode, body, submitError, isLoading } = useDataForm();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onCreate = () => {
    if (!submitError) {
      createMutation(transformBodyOnSubmit(body))
        .then((res: any) => {
          navigate('../' + res.id);
          toast(
            createSuccessToast({
              verbLabel: 'create',
              dataLabel: `${dataLabel}`,
              id,
            }),
          );
        })
        .catch((err: any) => {
          console.error(err);
          toast(
            createErrorToast({
              verbLabel: 'create',
              dataLabel: `${dataLabel}`,
            }),
          );
        });
    }
  };

  const onSave = () => {
    if (!submitError) {
      saveMutation(transformBodyOnSubmit(body))
        .then((res: any) => {
          navigate('../' + res.id);
          toast(
            createSuccessToast({
              verbLabel: 'save',
              dataLabel: `${dataLabel}`,
              id,
            }),
          );
        })
        .catch((err: any) => {
          console.error(err);
          toast(
            createErrorToast({ verbLabel: 'save', dataLabel: `${dataLabel}` }),
          );
        });
    }
  };

  const { title, handler, verb, icon } = {
    [Mode.READ]: {
      title: toToolbarName(body) || '',
      handler: () => navigate('edit'),
      icon: Pencil,
      verb: 'Edit',
    },
    [Mode.EDIT]: {
      title: toToolbarName(body) || '',
      handler: onSave,
      icon: Save,
      verb: 'Save',
    },
    [Mode.CREATE]: {
      title: `Create ${dataLabel}`,
      handler: onCreate,
      verb: 'Create',
    },
  }[mode];

  return (
    <div className="bg-muted flex w-64 flex-shrink-0 flex-col border-l">
      <div
        style={{ marginTop: '0.5px' }}
        className="flex h-11 flex-shrink-0 items-center border-b px-2"
      >
        <h3 className="flex-grow pl-2 align-middle text-sm font-medium">
          {title}
        </h3>
        <IconButton
          disabled={isSubmitting || mode === Mode.EDIT}
          onClick={() => navigate(mode === Mode.EDIT ? `../${id}` : '..')}
          variant="ghost"
          icon={XIcon}
          tooltip="Close"
        />
      </div>
      <div className="flex-grow space-y-4 overflow-y-scroll px-2 pb-3 pt-4">
        {error ? <Error className="h-full" error={error} /> : children}
      </div>
      <div className="flex h-11 flex-shrink-0 items-center gap-2 border-t px-2">
        {mode === Mode.EDIT && (
          <Button
            onClick={() => navigate(mode === Mode.EDIT ? `../${id}` : '..')}
            variant="outline"
            className="w-[100%-0.25rem] flex-grow"
          >
            Cancel
          </Button>
        )}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span tabIndex={0} className="w-[100%-0.25rem] flex-grow">
              <IconButton
                className="w-full"
                key={mode}
                disabled={
                  !!error ||
                  isSubmitting ||
                  !!submitError ||
                  !!disableEdit ||
                  isLoading
                }
                onClick={handler}
                variant={mode === Mode.READ ? 'outline' : 'default'}
                icon={icon}
                text={verb}
              />
            </span>
          </Tooltip.Trigger>
          {submitError && <Tooltip.Content>{submitError}</Tooltip.Content>}
          <Tooltip.Content>
            {disableEdit
              ? disableEdit
              : submitError
                ? submitError
                : 'Click to proceed'}
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  );
}
