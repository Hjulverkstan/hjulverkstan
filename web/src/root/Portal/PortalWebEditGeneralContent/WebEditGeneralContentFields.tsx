import * as DataForm from '@components/DataForm';
import { Languages } from 'lucide-react';

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
        label={
          <span className="flex items-center gap-1">
            <Languages className="h-4 w-4" />
            <span className="font-bold">Value</span>
          </span>
        }
        dataKey="value"
        placeholder="Enter content"
      />
      <DataForm.Image label="Image URL" dataKey="imageURL" />
    </>
  );
}
