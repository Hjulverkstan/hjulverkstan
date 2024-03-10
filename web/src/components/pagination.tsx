import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

import { cn } from '@utils';
import * as Select from '@components/ui/select';
import { Button } from '@components/ui/button';

interface PaginationProps {
  page: number;
  pageSize: number;
  pageCount: number;
  onUpdatePageSize: (pageSize: number) => void;
  onUpdatePage: (page: number) => void;
  disabled?: boolean;
  comment?: string;
  className?: string;
}

export default function Pagination({
  page,
  pageSize,
  pageCount,
  onUpdatePageSize,
  onUpdatePage,
  className,
  disabled = false,
  comment = '',
}: PaginationProps) {
  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="flex-1 text-sm text-muted-foreground">{comment}</div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select.Root
            value={`${pageSize}`}
            onValueChange={(val) => onUpdatePageSize(Number(val))}
          >
            <Select.Trigger className="h-8 w-[70px]">
              <Select.Value placeholder={pageSize} />
            </Select.Trigger>
            <Select.Content side="top">
              {[10, 20, 30, 40, 50].map((el) => (
                <Select.Item key={el} value={`${el}`}>
                  {el}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <div
          className="flex w-[100px] items-center justify-center text-sm
            font-medium"
        >
          Page {page + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => onUpdatePage(0)}
            disabled={disabled || page === 0}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onUpdatePage(page - 1)}
            disabled={disabled || page === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onUpdatePage(page + 1)}
            disabled={disabled || page < pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => onUpdatePage(pageCount - 1)}
            disabled={disabled || page < pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
