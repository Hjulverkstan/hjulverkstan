import { useParams } from 'react-router-dom';

import { initEmployee, employeeZ } from '@data/employee/form';
import { useCreateEmployeeM, useEditEmployeeM } from '@data/employee/mutations';
import { useEmployeeQ, useEmployeesQ } from '@data/employee/queries';

import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';

import { PageContentProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';

import AdminEmployeesActions from './AdminEmployeesActions';
import AdminEmployeesFields from './AdminEmployeesFields';
import AdminEmployeesFilters from './AdminEmployeesFilters';
import useColumns from './useColumns';
import { Employee } from '@data/employee/types';

//

export default function PortalAdminEmployees({ mode }: PageContentProps) {
  const { id = '' } = useParams();

  const employeesQ = useEmployeesQ();
  const employeeQ = useEmployeeQ({ id });
  const createEmployeeM = useCreateEmployeeM();
  const editEmployeeM = useEditEmployeeM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="employees"
      tableKey="employees"
      disabled={mode && mode !== Mode.READ}
      data={employeesQ.data}
    >
      <PortalToolbar dataLabel="employee">
        <AdminEmployeesFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={AdminEmployeesActions}
          columns={columns}
          isLoading={employeesQ.isLoading}
          error={employeesQ.error}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={employeeQ.isLoading}
            data={employeeQ.data}
            zodSchema={employeeZ}
            initCreateBody={initEmployee}
          >
            <PortalForm
              toToolbarName={(body: Employee) =>
                body.firstName && `${body.firstName} ${body.lastName}`
              }
              dataLabel="Employee"
              error={employeeQ.error}
              isSubmitting={
                createEmployeeM.isLoading || editEmployeeM.isLoading
              }
              saveMutation={editEmployeeM.mutateAsync}
              createMutation={createEmployeeM.mutateAsync}
            >
              <AdminEmployeesFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
