import * as DataForm from '@components/DataForm';

export default function AdminLocationFields() {
  return (
    <>
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
        placeholder="19731224-0001"
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
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />
    </>
  );
}
