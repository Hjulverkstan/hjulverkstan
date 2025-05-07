import * as enums from '@data/user/enums';
import * as DataForm from '@components/DataForm';

export default function AdminUsersFields() {
  const { mode, body } = DataForm.useDataForm();

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
        <>
          <DataForm.Input
            type="password"
            placeholder="********"
            label="Password"
            dataKey="password"
          />
          <DataForm.Input
            type="password"
            placeholder="********"
            label="Repeat Password"
            dataKey="passwordrepeat"
            onPaste={(e) => e.preventDefault()}
          />
        </>
      )}
      {mode === DataForm.Mode.EDIT && (
        <>
          <DataForm.Input
            type="password"
            placeholder="********"
            label="Change Password"
            dataKey="password"
          />
          {body.password?.length && (
            <DataForm.Input
              type="password"
              placeholder="********"
              label="Repeat Password"
              dataKey="passwordrepeat"
              onPaste={(e) => e.preventDefault()}
            />
          )}
        </>
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
