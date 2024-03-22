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
  data: Partial<D>;
  setData: (dataKey: string, value: any) => void;
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
  initData: Partial<D>;
  children: ReactNode;
}

/**
 *
 */

export function Provider<D extends Data>({
  mode,
  isLoading,
  data: dataRaw,
  zodSchema,
  initData,
  children,
}: DataFormProps<D>) {
  const { toast } = useToast();
  const prevDataRaw = useRef<D | undefined>();
  const [data, setData] = useState<Partial<D> | undefined>();

  console.log('-----');
  console.log('isLoading', isLoading);
  console.log('data', data);

  useEffect(() => {
    const applyRawData = () => {
      setData(dataRaw);
      prevDataRaw.current = dataRaw;
    };

    console.log('raw', dataRaw);

    if (!data) {
      if (mode === Mode.CREATE) setData(initData);
      else if (dataRaw) applyRawData();
    } else {
      if (dataRaw !== prevDataRaw.current) {
        if (mode === Mode.READ) applyRawData();
        if (mode === Mode.EDIT) toast(createRefreshToast(applyRawData));
      }
    }
  }, [dataRaw, mode]);

  //

  const safeData: Partial<D> = data ?? {};

  const validationIssues = useMemo(() => {
    const zodRet = zodSchema.safeParse(data);

    return zodRet.success ? [] : zodRet.error.issues;
  }, [zodSchema, data]);

  const isSkeleton = isLoading && !data;
  const isDisabled = mode === Mode.READ || isSkeleton;

  const form: UseDataFormReturn<D> = {
    data: safeData,
    setData: (dataKey: string, value: any) =>
      setData((prev) => prev && { ...prev, [dataKey]: value }),
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
  const { isSkeleton, data, setData, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isDisabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('justify-between', isDisabled && '!opacity-70')}
          >
            {isSkeleton
              ? ''
              : data[dataKey]
                ? options.find((option) => option.value === data[dataKey])?.name
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
                    if (value !== data[dataKey]) setData(dataKey, value);
                    setOpen(false);
                  }}
                >
                  {name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === data[dataKey] ? 'opacity-100' : 'opacity-0',
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
  const { data, setData, isDisabled, isSkeleton } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <InputDumb
        id={dataKey}
        disabled={isDisabled}
        placeholder={placeholder}
        value={isSkeleton ? '' : data[dataKey] ?? ''}
        onChange={({ target: { value } }) => {
          if (data[dataKey] !== value) setData(dataKey, value);
        }}
        className={cn('h-8 bg-background', isDisabled && '!opacity-70')}
      />
    </Field>
  );
}
