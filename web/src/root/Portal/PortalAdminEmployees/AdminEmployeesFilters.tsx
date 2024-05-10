import * as DataTable from '@components/DataTable';
import { Employee } from '@data/employee/types';

export default function AdminEmployeeFilters() {
  return (
    <DataTable.FilterSearch
      placeholder="Search in Employees..."
      matchFn={(word: string, row: Employee) =>
        DataTable.fuzzyMatchFn(
          [
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'personalIdentityNumber',
            'employeeNumber',
          ],
          word,
          row,
        )
      }
    />
  );
}
