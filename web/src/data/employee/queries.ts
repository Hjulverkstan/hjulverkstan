import { useQuery } from 'react-query';

import EmployeeIcon from '@components/EmployeeIcon';

import { EnumAttributes } from '../enums';
import { ErrorRes } from '../api';
import { Employee } from './types';
import * as api from './api';

//

export const useEmployeesQ = () =>
  useQuery<Employee[], ErrorRes>(api.createGetEmployees());

//

export const useEmployeesAsEnumsQ = ({ dataKey = 'employeeId' } = {}) =>
  useQuery<Employee[], ErrorRes, EnumAttributes[]>({
    ...api.createGetEmployees(),
    select: (employees) =>
      employees?.map((employee) => ({
        dataKey,
        icon: (props) => EmployeeIcon({ ...props, employee }),
        label: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      })) ?? [],
  });
