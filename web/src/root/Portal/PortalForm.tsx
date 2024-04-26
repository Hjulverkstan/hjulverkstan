import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Save, XIcon } from 'lucide-react';
import { ReactNode } from 'react';

import * as Tooltip from '@components/ui/Tooltip';
import { ErrorRes } from '@api';
import { Mode, useDataForm } from '@components/DataForm';
import { Button, IconButton } from '@components/ui/Button';
import { useToast } from '@components/ui/use-toast';
import Error from '@components/Error';

import { createErrorToast } from './toast';

export interface PortalFormProps {
  /* Optionaly tranform the body on submit before passed to mutate function */
  transformBodyOnSubmit?: (input: any) => any;
  isSubmitting: boolean;
  /* muateAsync from useMutation() */
  createMutation: (body: any) => Promise<any>;
  /* muateAsync from useMutation() */
  saveMutation: (body: any) => Promise<any>;
  error?: ErrorRes | null;
  dataLabel: string;
  children: ReactNode;
}

export default function PortalForm({
  isSubmitting,
  createMutation,
  saveMutation,
  error,
  children,
  dataLabel,
  transformBodyOnSubmit = (x) => x,
}: PortalFormProps) {
  const { id = '' } = useParams();
  const { mode, body, submitError } = useDataForm();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onCreate = () => {
    if (!submitError) {
      createMutation(transformBodyOnSubmit(body))
        .then((res: any) => navigate('../' + res.id))
        .catch((err: any) => {
          console.error(err);
          toast(
            createErrorToast({ verbLabel: 'create', dataLabel: 'vehicle' }),
          );
        });
    }
  };

  const onSave = () => {
    if (!submitError) {
      saveMutation(transformBodyOnSubmit(body))
        .then((res: any) => navigate('../' + res.id))
        .catch((err: any) => {
          console.error(err);
          toast(createErrorToast({ verbLabel: 'save', dataLabel: 'vehicle' }));
        });
    }
  };

  const { title, handler, verb, icon } = {
    [Mode.READ]: {
      title: dataLabel,
      handler: () => navigate('edit'),
      icon: Pencil,
      verb: 'Edit',
    },
    [Mode.EDIT]: {
      title: `Edit ${dataLabel.toLowerCase()}`,
      handler: onSave,
      icon: Save,
      verb: 'Save',
    },
    [Mode.CREATE]: {
      title: `Create ${dataLabel.toLowerCase()}`,
      handler: onCreate,
      verb: 'Create',
    },
  }[mode];

  return (
    <div className="bg-muted flex w-72 flex-col rounded-md border">
      <div className="flex h-10 items-center border-b p-2">
        <h3 className="flex-grow pl-2 align-middle text-sm font-medium">
          {title}
        </h3>
        <IconButton
          disabled={!!error || isSubmitting || mode === Mode.EDIT}
          onClick={() => navigate(mode === Mode.EDIT ? `../${id}` : '..')}
          variant="ghost"
          icon={XIcon}
          tooltip="Close"
        />
      </div>
      {error ? (
        <Error error={error} />
      ) : (
        <div className="flex-grow space-y-4 overflow-y-scroll px-2 pb-3 pt-4">
          {children}
        </div>
      )}

      <div className="10 flex flex-shrink gap-2 border-t px-2 py-2">
        {mode === Mode.EDIT && (
          <Button
            onClick={() => navigate(mode === Mode.EDIT ? `../${id}` : '..')}
            variant="outline"
            className="w-[100%-0.25rem] flex-grow"
          >
            Cancel
          </Button>
        )}
        <Tooltip.Root disableHoverableContent={!submitError}>
          <Tooltip.Trigger asChild>
            <span tabIndex={0} className="w-[100%-0.25rem] flex-grow">
              <IconButton
                className="w-full"
                key={mode}
                disabled={!!error || isSubmitting || !!submitError}
                onClick={handler}
                variant={mode === Mode.READ ? 'outline' : 'default'}
                icon={icon}
                text={verb}
                tooltip={verb}
              />
            </span>
          </Tooltip.Trigger>
          {submitError && <Tooltip.Content>{submitError}</Tooltip.Content>}
        </Tooltip.Root>
      </div>
    </div>
  );
}
