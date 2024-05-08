import * as enums from '@data/location/enums';
import * as DataForm from '@components/DataForm';

export default function AdminLocationFields() {
  return (
    <>
      <DataForm.Select
        label="Type"
        dataKey="locationType"
        enums={enums.locationType}
      />

      <DataForm.Input
        placeholder="Write the name..."
        label="Name"
        dataKey="name"
      />

      <DataForm.Input
        placeholder="Write the address..."
        label="Address"
        dataKey="address"
      />

      <DataForm.Input
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />
    </>
  );
}
