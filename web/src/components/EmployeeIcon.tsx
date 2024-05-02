import { Employee } from '@data/employee/types';
import * as U from '@utils';

export interface EmployeeIconProps {
  employee: Employee;
  className?: string;
}

// TODO: Add all seven colors

const colors = [
  'bg-success-fill border-box border border-success-border text-success-foreground',
  'bg-warn-fill border-box border border-warn-border text-warn-foreground',
  'bg-destructive-fill border-box border border-destructive-border text-destructive-foreground',
];

export default function EmployeeIcon({
  className,
  employee,
}: EmployeeIconProps) {
  const colorIndex = Number(employee.id) % colors.length;
  return (
    <div
      className={U.cn(
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
