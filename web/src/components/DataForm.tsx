import { ZodType, ZodIssue } from 'zod';
import {
  useState,
  useContext,
  useMemo,
  createContext,
  useEffect,
  useRef,
  ReactNode,
  ComponentType,
} from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@utils';
import { createRefreshToast } from '../root/Portal/toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/Popover';
import { Button } from '@components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@components/ui/Command';

import { Input as InputDumb } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import { useToast } from '@components/ui/use-toast';

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
  validationIssues: ZodIssue[];
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

export function Provider<D extends Data>({
  mode,
  isLoading,
  data,
  zodSchema,
  initCreateBody,
  children,
}: DataFormProps<D>) {
  const { toast } = useToast();
  const [body, setBody] = useState<Partial<D> | undefined>();

  const prevData = useRef<D | undefined>();
  const prevMode = useRef<Mode | undefined>();

  useEffect(() => {
    const applyData = () => {
      setBody(data);
      prevData.current = data;
    };

    // Just entered CREATE
    if (prevMode.current !== Mode.CREATE && mode === Mode.CREATE) {
      console.log('iniiiit', initCreateBody);
      setBody(initCreateBody);
    }

    // In READ or EDIT and no state is set yet
    if (mode !== Mode.CREATE && !body) applyData();

    // We have new data
    if (body && data !== prevData.current) {
      if (mode === Mode.READ) applyData();
      if (mode === Mode.EDIT) toast(createRefreshToast(applyData));
    }

    prevMode.current = mode;
  }, [data, mode]);

  //

  const safeBody: Partial<D> = body ?? {};

  const validationIssues = useMemo(() => {
    const zodRet = zodSchema.safeParse(body);

    return zodRet.success ? [] : zodRet.error.issues;
  }, [zodSchema, body]);

  const isSkeleton = isLoading && !body;
  const isDisabled = mode === Mode.READ || isSkeleton;

  const form: UseDataFormReturn<D> = {
    body: safeBody,
    setBodyProp: (dataKey: string, value: any) =>
      setBody((prev) => prev && { ...prev, [dataKey]: value }),
    isLoading,
    isDisabled,
    isSkeleton,
    validationIssues,
    mode,
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
}

export function Select({ label, dataKey, options, description }: SelectProps) {
  const { isSkeleton, body, setBodyProp, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={dataKey}
            disabled={isDisabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('justify-between', isDisabled && '!opacity-70')}
          >
            {isSkeleton
              ? ''
              : body[dataKey]
                ? options.find((option) => option.value === body[dataKey])?.name
                : `Select ${label.toLowerCase()}...`}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" id={dataKey}>
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}`}
              className="h-9"
            />
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map(({ value, name }) => (
                <CommandItem
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

//

export interface InputProps extends Omit<FieldProps, 'children'> {
  placeholder: string;
}

export function Input({
  label,
  dataKey,
  placeholder,
  description,
}: InputProps) {
  const { body, setBodyProp, isDisabled, isSkeleton } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <InputDumb
        id={dataKey}
        disabled={isDisabled}
        placeholder={placeholder}
        value={isSkeleton ? '' : body[dataKey] ?? ''}
        onChange={({ target: { value } }) => {
          if (body[dataKey] !== value) setBodyProp(dataKey, value);
        }}
        className={cn('h-8 bg-background', isDisabled && '!opacity-70')}
      />
    </Field>
  );
}
