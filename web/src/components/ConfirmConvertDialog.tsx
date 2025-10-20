import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { RepeatIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import BadgeGroup, { Badge } from '@components/BadgeGroup';
import { capitalize } from '@utils/common';
import { useVehiclesQ } from '@data/vehicle/queries';

interface confirmConvertDialogProps {
  title: string;
  description?: string;
  onConfirm: (arg: any) => void;
  onClose?: () => void;
  vehicleIds: string[];
}

export default function ConfirmConvertDialog({
  title,
  description,
  onConfirm,
  onClose,
  vehicleIds,
}: confirmConvertDialogProps) {
  const vehiclesQ = useVehiclesQ();

  const badges: Badge[] = useMemo(
    () =>
      !vehiclesQ.data
        ? []
        : vehicleIds
            .map((id) => vehiclesQ.data.find((v) => v.id === id))
            .filter((v) => !!v)
            .map((v) => ({
              label: v.isCustomerOwned ? `#${v.id}` : v.regTag,
              variant: 'secondary',
              tooltip: capitalize(v.vehicleType),
            })),
    [vehiclesQ.data],
  );

  return (
    <DialogContent className="flex flex-col sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{`${title}`}</DialogTitle>

        <DialogDescription>{`${description}`}</DialogDescription>
        <div className="w-full pt-1.5 [&>div]:flex-wrap">
          <BadgeGroup limit={20} badges={badges} />
        </div>
      </DialogHeader>

      <DialogFooter>
        {onClose && (
          <DialogClose asChild>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        )}
        <DialogClose asChild>
          <IconButton
            variant={'red'}
            type="submit"
            onClick={onConfirm}
            icon={RepeatIcon}
            text="Convert"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
