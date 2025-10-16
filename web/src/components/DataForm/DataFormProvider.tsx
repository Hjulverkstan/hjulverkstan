import { ZodType, ZodIssue } from 'zod';
import {
  useState,
  useContext,
  useMemo,
  createContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

import * as U from '@utils';
import { useToast } from '@components/shadcn/use-toast';

import { createRefreshToast } from '../../root/Portal/toast';
import { Mode, Data } from './';

export interface UseDataFormReturn<D = Data> {
  isLoading: boolean;
  isDisabled: boolean;
  body: Partial<D>;
  setBodyProp: (dataKey: string, value: any) => void;
  fieldErrorMap: Record<string, string>;
  registerManualIssue: (key: string, message: string | null) => void;
  submitError?: string;
  mode: Mode;
}

const DataFormContext = createContext<undefined | UseDataFormReturn<Data>>(
  undefined,
);

export const useDataForm = () => {
  const form = useContext<UseDataFormReturn<any> | undefined>(DataFormContext);

  if (!form) throw Error('useDataForm must be in a <DataForm.Provider />');

  return form;
};

//

interface DataFormProps<D> {
  // Data to repopulate the form when in EDIT / READ.
  data?: D;
  // Display the error state
  error?: string;
  isLoading: boolean;
  // Changing mode will remount the form and boot up with the correct mechanics.
  mode: Mode;
  // Used to validate the form
  zodSchema: ZodType<any>;
  // Required to populate the body when in CREATE mode.
  initCreateBody: Partial<D>;
  // Here you fill with the other DataForm components to construct your form.
  children: ReactNode;
}

const issuesToPathErrorMap = (issues: ZodIssue[]) =>
  issues.reduce<Record<string, string>>(
    (acc, { path, message }) =>
      acc[path[0] as string] ? acc : { ...acc, [path[0]]: message },
    {},
  );

/**
 * The <DataForm.Provider /> houses the logic for the DataForm components. The
 * purpose is to provide a package-solution building forms on CRUD entities. It
 * handles the standard modes READ, EDIT and CREATE accordingly and gives all
 * the necessary components to construct most form, with validation mechanics
 * built-in.
 *
 */

// Wrap the Provider with the withLobotomizer hoc to simplify its business
// logic. By doing so, the component will be destroyed and remounted when ever
// the `mode` prop is changed. This way, we don't need to manually reset
// states and reinitialize the component using complicated useEffects when ever
// the mode changes.

export const Provider = U.withLobotomizer(
  (props) => props.mode,
  <D extends Data>({
    mode,
    isLoading: isLoadingProp,
    data,
    zodSchema,
    initCreateBody,
    children,
  }: DataFormProps<D>) => {
    const { toast } = useToast();

    const [body, setBody] = useState<Partial<D>>(
      mode === Mode.CREATE ? initCreateBody : (data ?? {}),
    );

    // Derive the data form context value
    const isLoading = !body;
    const isDisabled = isLoadingProp || isLoading || mode === Mode.READ;

    const [manualIssuesMap, setManualIssueMap] = useState<
      Record<string, string>
    >({});

    const registerManualIssue = (key: string, message: string | null) =>
      setManualIssueMap((map) => {
        if (message) return { [key]: message };
        else {
          delete map[key];
          return map;
        }
      });

    const manualIssues = Object.values(manualIssuesMap);

    const bodyIssues = useMemo(() => {
      const zodRet = zodSchema.safeParse(body);
      return zodRet.success ? [] : zodRet.error.issues;
    }, [body]);

    const allIssues = [
      ...bodyIssues,
      ...manualIssues.map((message) => ({ message })),
    ];

    const fieldErrorMap = useMemo(
      () =>
        issuesToPathErrorMap(
          mode === Mode.CREATE
            ? // Only show errors on user-modified fields in create mode.
              bodyIssues.filter(
                ({ path }) => initCreateBody[path[0]] !== body[path[0]],
              )
            : // Don't show errors if mode is read...
              mode === Mode.EDIT
              ? bodyIssues
              : [],
        ),
      [mode, bodyIssues],
    );

    const submitError = mode === Mode.READ ? undefined : bodyIssues[0]?.message;

    const setBodyProp = useCallback(
      (dataKey: string, value: any) =>
        setBody((prev) => prev && { ...prev, [dataKey]: value }),
      [],
    );

    const form = {
      body,
      mode,
      setBodyProp,
      isLoading,
      isDisabled,
      fieldErrorMap,
      submitError,
      allIssues,
      registerManualIssue,
    };

    // Update body on new data but prompt user first if new change while editing

    const [initializedData, setInitializedData] = useState(data);

    useEffect(() => {
      if (mode !== Mode.CREATE && data) {
        const applyData = () => {
          setBody(data as D);
          setInitializedData(data);
        };

        const isOverridingDataInEdit =
          mode === Mode.EDIT &&
          initializedData &&
          !U.shallowEq(initializedData, data);

        if (isOverridingDataInEdit) toast(createRefreshToast(applyData));
        else applyData();
      }
    }, [initializedData, data, mode]);

    //

    return (
      <DataFormContext.Provider value={form}>
        {children}
      </DataFormContext.Provider>
    );
  },
);

Provider.displayName = 'DataFormProvider';
