import * as enumsRaw from '@data/user/enums';
import * as DataForm from '@components/DataForm';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { useLocationsAsEnumsQ } from '@data/location/queries';

export default function AdminUsersFields() {
  const { mode, body } = DataForm.useDataForm();

  const enums = useTranslateRawEnums(enumsRaw);
  const { data: locationEnums = [] } = useLocationsAsEnumsQ();

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

      <DataForm.Select
        label="Default Location"
        dataKey="locationId"
        enums={locationEnums}
      />
    </>
  );
}
