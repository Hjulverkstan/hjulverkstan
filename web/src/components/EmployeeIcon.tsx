import { Employee } from '@data/employee/types';
import * as C from '@utils/common';

export interface EmployeeIconProps {
  employee: Employee;
  className?: string;
}

// TODO: Add all seven colors

const colors = [
  'bg-green-fill border-box border border-green-border' +
    ' text-green-foreground',
  'bg-yellow-fill border-box border border-yellow-border text-yellow-foreground',
  'bg-red-fill border-box border border-red-border text-red-foreground',
  'bg-blue-fill border-box border border-blue-border text-blue-foreground',
  'bg-purple-fill border-box border border-purple-border' +
    ' text-purple-foreground',
];

export default function EmployeeIcon({
  className,
  employee,
}: EmployeeIconProps) {
  const colorIndex = Number(employee.id) % colors.length;
  return (
    <div
      className={C.cn(
        className,
        colors[colorIndex],
        'flex h-6 w-6 items-center justify-center rounded-full font-medium',
      )}
    >
      <span style={{ fontSize: '0.6rem' }}>
        {employee.firstName[0].toUpperCase() +
          employee.lastName[0].toUpperCase()}
      </span>
    </div>
  );
}
