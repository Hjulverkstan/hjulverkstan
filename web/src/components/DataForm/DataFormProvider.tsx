import { ZodType, ZodIssue } from 'zod';
import {
  useState,
  useContext,
  useMemo,
  createContext,
  useEffect,
  ReactNode,
} from 'react';

import * as U from '@utils';
import { useToast } from '@components/shadcn/use-toast';

import { createRefreshToast } from '../../root/Portal/toast';
import { Mode, Data } from './';

export interface UseDataFormReturn<D = Data> {
  isLoading: boolean;
  isDisabled: boolean;
  isSkeleton: boolean;
  body: Partial<D>;
  setBodyProp: (dataKey: string, value: any) => void;
  fieldErrorMap: Record<string, string>;
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

export const Provider = <D extends Data>({
  mode,
  isLoading,
  data,
  zodSchema,
  initCreateBody,
  children,
}: DataFormProps<D>) => {
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
};

Provider.displayName = 'DataFormProvider';
