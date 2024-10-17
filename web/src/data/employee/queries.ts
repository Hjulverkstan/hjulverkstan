import { useQuery } from '@tanstack/react-query';

import EmployeeIcon from '@components/EmployeeIcon';

import { EnumAttributes } from '../enums';
import { StandardError } from '../api';
import { Employee } from './types';
import * as api from './api';

//

export const useEmployeesQ = () =>
  useQuery<Employee[], StandardError>(api.createGetEmployees());

export interface UseEmployeeQProps {
  id: string;
}

export const useEmployeeQ = ({ id }: UseEmployeeQProps) =>
  useQuery<Employee, StandardError>({
    ...api.createGetEmployee({ id }),
    enabled: !!id,
  });

//

export const useEmployeesAsEnumsQ = ({ dataKey = 'employeeId' } = {}) =>
  useQuery<Employee[], StandardError, EnumAttributes[]>({
    ...api.createGetEmployees(),
    select: (employees) =>
      employees?.map((employee) => ({
        dataKey,
        icon: (props) => EmployeeIcon({ ...props, employee }),
        label: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      })) ?? [],
  });
