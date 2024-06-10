import * as enums from '@data/customer/enums';
import * as DataForm from '@components/DataForm';
import { CustomerType } from '@data/customer/types';

export default function ShopCustomerFields() {
  const { body } = DataForm.useDataForm();

  return (
    <>
      <DataForm.Select
        label="Type"
        dataKey="customerType"
        enums={enums.customerType}
      />

      {body.customerType === CustomerType.ORG && (
        <DataForm.Input
          placeholder="Write organization name"
          label="Organization name"
          dataKey="organizationName"
        />
      )}

      <DataForm.Input
        placeholder="Write first name..."
        label="First name"
        dataKey="firstName"
      />

      <DataForm.Input
        placeholder="Write last name..."
        label="Last name"
        dataKey="lastName"
      />

      <DataForm.Input
        placeholder="7312240001"
        label="Personal identity nr"
        dataKey="personalIdentityNumber"
      />

      <DataForm.Input
        type="tel"
        placeholder="+46712345678"
        label="Phone number"
        dataKey="phoneNumber"
      />

      <DataForm.Input
        type="email"
        placeholder="emailaddress@domain.com"
        label="Email"
        dataKey="email"
      />

      <DataForm.Input
        type="addr"
        placeholder="Write customer's address..."
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
