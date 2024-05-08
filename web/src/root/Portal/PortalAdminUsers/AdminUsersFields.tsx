import * as enums from '@data/user/enums';
import * as DataForm from '@components/DataForm';

export default function AdminUsersFields() {
  const { mode } = DataForm.useDataForm();

  return (
    <>
      <DataForm.Input
        placeholder="Write username"
        label="Username"
        dataKey="username"
      />

      <DataForm.Input
        type="email"
        placeholder="emailaddress@domain.com"
        label="Email"
        dataKey="email"
      />

      {mode === DataForm.Mode.CREATE && (
        <DataForm.Input
          type="password"
          placeholder="********"
          label="Password"
          dataKey="password"
        />
      )}

      <DataForm.Select
        label="Role"
        dataKey="roles"
        isMultiSelect
        enums={enums.roles}
      />
    </>
  );
}
