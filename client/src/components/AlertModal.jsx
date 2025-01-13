import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const AlertModal = ({
  isAlertModalOpen,
  setIsAlertModalOpen,
  confirmDeleteImg,
  message,
}) => {
  return (
    <AlertDialog
      variant={"solid"}
      open={isAlertModalOpen}
      onOpenChange={setIsAlertModalOpen}
    >
      <AlertDialogContent className="bg-slate-300">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            onClick={() => {
              confirmDeleteImg(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-400"
            variant="destructive"
            onClick={() => confirmDeleteImg(true)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
