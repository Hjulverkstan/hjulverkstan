import { Field, FieldProps, Mode, useDataForm } from './';
import { IconButton } from '@components/shadcn/Button';
import { useDialogManager } from '@components/DialogManager';
import RichTextEditorDialog from '@components/RichTextEditorDialog';
import { Eye, Pencil, TextCursor } from 'lucide-react';

export interface RichTextProps extends Omit<FieldProps, 'children'> {}

export const RichText = ({
  label,
  dataKey,
  description,
  icon,
  variant,
}: RichTextProps) => {
  const { openDialog } = useDialogManager();
  const { getBodyProp, setBodyProp, mode } = useDataForm();

  const data = getBodyProp(dataKey);

  return (
    <Field
      label={label}
      dataKey={dataKey}
      description={description}
      icon={icon}
      variant={variant}
    >
      <IconButton
        variant="outline"
        icon={
          !data
            ? mode === Mode.READ
              ? undefined
              : Pencil
            : mode === Mode.READ
              ? Eye
              : TextCursor
        }
        tooltip="Open text editor"
        text={
          !data
            ? mode === Mode.READ
              ? 'No text yet'
              : 'Create in editor'
            : mode === Mode.READ
              ? 'View in editor'
              : 'Edit in editor'
        }
        className={
          (variant === 'translation' &&
            'border-purple/70 border' + ' hover:border-purple/50') ||
          ''
        }
        disabled={!data && mode === Mode.READ}
        onClick={() =>
          openDialog(
            <RichTextEditorDialog
              content={data}
              onSubmit={(next) => setBodyProp(dataKey, next)}
            />,
          )
        }
      />
    </Field>
  );
};

RichText.displayName = 'DataFormRichText';
