import { ZodType, ZodIssue } from 'zod';
import {
  useState,
  useContext,
  useMemo,
  createContext,
  useEffect,
  ReactNode,
  ComponentType,
} from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import * as U from '@utils';
import { cn } from '@utils';
import { Input as InputDumb } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import { useToast } from '@components/ui/use-toast';
import { Button } from '@components/ui/Button';
import * as Popover from '@components/ui/Popover';
import * as Command from '@components/ui/Command';

import { createRefreshToast } from '../root/Portal/toast';

//

export type Data = Record<string, any>;

export enum Mode {
  EDIT = 'edit',
  READ = 'read',
  CREATE = 'create',
}

export interface UseDataFormReturn<D = Data> {
  isLoading: boolean;
  isDisabled: boolean;
  isSkeleton: boolean;
  body: Partial<D>;
  setBodyProp: (dataKey: string, value: any) => void;
  fieldErrorMap?: Record<string, string>;
  submitError?: string;
  mode: Mode;
}

const DataFormContext = createContext<undefined | UseDataFormReturn<Data>>(
  undefined,
);

export const useDataForm = () => {
  const form = useContext<UseDataFormReturn<any> | undefined>(DataFormContext);

  if (!form) throw Error('useDataForm must be in a <Form.Root />');

  return form;
};

//

interface DataFormProps<D> {
  data?: D;
  error?: string;
  isLoading: boolean;
  mode: Mode;
  zodSchema: ZodType<any>;
  initCreateBody: Partial<D>;
  children: ReactNode;
}

/**
 *
 */

const issuesToPathErrorMap = (issues: ZodIssue[]) =>
  issues.reduce<Record<string, string>>(
    (acc, { path, message }) =>
      acc[path[0] as string] ? acc : { ...acc, [path[0]]: message },
    {},
  );

export function Provider<D extends Data>({
  mode,
  isLoading,
  data,
  zodSchema,
  initCreateBody,
  children,
}: DataFormProps<D>) {
  const { toast } = useToast();

  const [state, setState] = useState<Partial<D> | undefined>();
  const [initializedMode, setInitializedMode] = useState<Mode | undefined>();

  const updateState = (state: Partial<D>) => {
    setState(state);
    setInitializedMode(mode);
  };

  useEffect(() => {
    if (mode === Mode.CREATE) updateState(initCreateBody);
    else if (data) setInitializedMode(mode);
  }, [mode]);

  useEffect(() => {
    if (mode === Mode.READ && data) updateState(data);

    if (mode === Mode.EDIT && data) {
      const isOverridingData = state && !U.shallowEq(state, data);

      if (isOverridingData) toast(createRefreshToast(() => updateState(data)));
      else updateState(data);
    }
  }, [data]);

  //

  const body: Partial<D> =
    mode !== initializedMode
      ? mode === Mode.CREATE
        ? initCreateBody
        : state ?? data ?? {}
      : state!;

  const isSkeleton = mode !== Mode.CREATE && !Object.keys(body).length;
  const isDisabled = isSkeleton || mode === Mode.READ;

  const bodyIssues = useMemo(() => {
    const zodRet = zodSchema.safeParse(body);
    return zodRet.success ? [] : zodRet.error.issues;
  }, [body]);

  const fieldErrorMap = useMemo(
    () =>
      issuesToPathErrorMap(
        mode === Mode.CREATE
          ? bodyIssues.filter(
              ({ path }) => initCreateBody[path[0]] !== body[path[0]],
            )
          : mode === Mode.EDIT
            ? bodyIssues
            : [],
      ),
    [mode, bodyIssues],
  );

  const submitError = useMemo(
    () => (mode === Mode.READ ? undefined : bodyIssues[0]?.message),
    [mode, bodyIssues],
  );

  //

  const setBodyProp = (dataKey: string, value: any) =>
    setState((prev) => prev && { ...prev, [dataKey]: value });

  const form = {
    body,
    mode,
    setBodyProp,
    isLoading,
    isDisabled,
    isSkeleton,
    fieldErrorMap,
    submitError,
  };

  return (
    <DataFormContext.Provider value={form}>{children}</DataFormContext.Provider>
  );
}

//

export interface FieldProps {
  label: string;
  description?: string;
  dataKey: string;
  children: ReactNode;
}

export function Field({ dataKey, label, description, children }: FieldProps) {
  const { fieldErrorMap } = useDataForm();

  return (
    <div className="flex flex-col space-y-2">
      <Label className="px-2" htmlFor={dataKey}>
        {label}
      </Label>
      {children}
      {description && (
        <p className="px-2 text-[0.8rem] text-muted-foreground">
          {description}
        </p>
      )}
      {fieldErrorMap[dataKey] && (
        <div
          className="rounded-md bg-destructive-fill px-4 py-2 text-sm
            text-destructive-foreground"
        >
          {fieldErrorMap[dataKey]}
        </div>
      )}
    </div>
  );
}

//

export interface SelectOption {
  name: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface SelectProps extends Omit<FieldProps, 'children'> {
  options: SelectOption[];
  disabled?: boolean;
}

export function Select({
  label,
  dataKey,
  options,
  description,
  disabled,
}: SelectProps) {
  const { isSkeleton, body, setBodyProp, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  const isDisabledUnion = isDisabled || disabled;

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            id={dataKey}
            disabled={isDisabledUnion}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'justify-between',
              isDisabledUnion && 'opacity-70',
              !body[dataKey] && 'font-normal text-muted-foreground',
            )}
          >
            {isSkeleton
              ? ''
              : body[dataKey]
                ? options.find((option) => option.value === body[dataKey])?.name
                : `Select ${label.toLowerCase()}...`}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[200px] p-0" id={dataKey}>
          <Command.Root>
            <Command.Input
              placeholder={`Search ${label.toLowerCase()}`}
              className="h-9"
            />
            <Command.Empty>No {label.toLowerCase()} found.</Command.Empty>
            <Command.Group>
              {options.map(({ value, name }) => (
                <Command.Item
                  key={value}
                  value={value}
                  onSelect={() => {
                    if (value !== body[dataKey]) setBodyProp(dataKey, value);
                    setOpen(false);
                  }}
                >
                  {name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === body[dataKey] ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </Field>
  );
}

//

export interface InputProps extends Omit<FieldProps, 'children'> {
  placeholder: string;
  type?: string;
  min?: number;
  max?: number;
}

export function Input({
  label,
  type = 'text',
  min,
  max,
  dataKey,
  placeholder,
  description,
}: InputProps) {
  const { body, setBodyProp, isDisabled, isSkeleton } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <InputDumb
        type={type}
        min={min}
        max={max}
        id={dataKey}
        disabled={isDisabled}
        placeholder={placeholder}
        value={isSkeleton ? '' : body[dataKey] ?? ''}
        onChange={({ target: { value } }) => {
          if (body[dataKey] !== value) {
            setBodyProp(dataKey, type === 'number' ? Number(value) : value);
          }
        }}
        className={cn(
          'h-8 bg-background',
          isDisabled && '!cursor-default opacity-70',
        )}
      />
    </Field>
  );
}
