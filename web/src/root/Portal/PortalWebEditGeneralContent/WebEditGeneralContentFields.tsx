import * as DataForm from '@components/DataForm';

export default function WebEditGeneralContentsFields() {
  return (
    <>
      <DataForm.Input placeholder="Enter name..." label="Name" dataKey="name" />
      <DataForm.Input placeholder="Enter key..." label="Key" dataKey="key" />
      <DataForm.Input
        placeholder="Enter value..."
        label="Value"
        dataKey="value"
      />
      <DataForm.Input
        placeholder="Enter description..."
        label="Description"
        dataKey="description"
      />
    </>
  );
}
