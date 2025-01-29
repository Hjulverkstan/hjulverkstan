import * as DataForm from '@components/DataForm';

export default function WebEditGeneralContentFields() {
  return (
    <>
      <DataForm.Input
        label="Name"
        dataKey="name"
        placeholder="Enter name"
        disabled
      />
      <DataForm.Input
        label="Description"
        dataKey="description"
        placeholder="Enter description"
        disabled
      />
      <DataForm.Input
        label={<span className="font-bold">Value *</span>}
        dataKey="value"
        placeholder="Enter content"
      />
    </>
  );
}
