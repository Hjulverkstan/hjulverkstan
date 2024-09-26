import { useParams } from 'react-router-dom';

import * as U from '@utils';
import { initUser, userZ } from '@data/user/form';
import { useCreateUserM, useEditUserM } from '@data/user/mutations';
import { useUserQ, useUsersQ } from '@data/user/queries';

import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';

import { PageContentProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';

import AdminUsersActions from './AdminUsersActions';
import AdminUsersFields from './AdminUsersFields';
import AdminUsersFilters from './AdminUsersFilters';
import useColumns from './useColumns';
import { User } from '@data/user/types';

//

export default function PortalAdminUsers({ mode }: PageContentProps) {
  const { id = '' } = useParams();

  const usersQ = useUsersQ();
  const userQ = useUserQ({ id });
  const createUserM = useCreateUserM();
  const editUserM = useEditUserM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="users"
      tableKey="users"
      disabled={mode && mode !== Mode.READ}
      data={usersQ.data}
    >
      <PortalToolbar dataLabel="user">
        <AdminUsersFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={AdminUsersActions}
          columns={columns}
          isLoading={usersQ.isLoading}
          error={usersQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={userQ.isLoading}
            data={userQ.data}
            zodSchema={userZ}
            initCreateBody={initUser}
          >
            <PortalForm
              dataLabel="User"
              toToolbarName={({ username }: User) =>
                username && U.capitalize(username)
              }
              error={userQ.error}
              isSubmitting={createUserM.isLoading || editUserM.isLoading}
              saveMutation={editUserM.mutateAsync}
              createMutation={createUserM.mutateAsync}
            >
              <AdminUsersFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
