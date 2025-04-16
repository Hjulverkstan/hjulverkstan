import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@components/shadcn/Dialog";
import {Button, IconButton} from "@components/shadcn/Button";
import {RecycleIcon, Trash2} from "lucide-react";


interface confirmConvertDialogProps {
    title: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmConvertDialog({ title, onConfirm, onClose }: confirmConvertDialogProps) {
    //

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{`Convert ${title}`}</DialogTitle>
                <DialogDescription>
                    {`You are converting ${title}.`}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <IconButton
                        variant={'destructive'}
                        type="submit"
                        onClick={onConfirm}
                        icon={RecycleIcon}
                        text="Convert"
                    />
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}