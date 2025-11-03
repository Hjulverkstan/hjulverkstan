export type Data = Record<string, any>;

export enum Mode {
  EDIT = 'edit',
  READ = 'read',
  CREATE = 'create',
}

export * from './DataFormProvider';
export * from './DataFormField';
export * from './DataFormSelect';
export * from './DataFormInput';
export * from './DataFormDatePicker';
export * from './DataFormSwitch';
export * from './DataFormCollapsible';
export * from './DataFormImage';
export * from './DataFormRichText';
