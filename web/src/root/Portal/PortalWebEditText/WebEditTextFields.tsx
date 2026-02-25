import * as DataForm from '@components/DataForm';

export default function WebEditTextFields() {
  return (
    <>
      <DataForm.Input
        variant="translation"
        placeholder="Write translation"
        label="Value"
        dataKey="value"
      />
    </>
  );
}
