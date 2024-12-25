import TaskItem from "@/components/shared/task-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/fire-config";
import TaskForm from "@/form/task-form";
import { taskSchema } from "@/lib/validation";
import { TaskService } from "@/service/task.service";
import { useUserState } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import FillMode from "./fill-mode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ITask } from "@/types";
import { toast } from "sonner";
import { addMilliseconds, addMinutes, format } from "date-fns";

const Dashboard = () => {
  const [isEdting, setIsEdting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCurrentTask, setIsCurrentTask] = useState<ITask | null>(null);

  const [open, setOpen] = useState(false);

  const { user } = useUserState();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["tasks-data"],
    queryFn: TaskService.getTasks,
  });

  const onAdd = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return null;
    return addDoc(collection(db, "tasks"), {
      title,
      startTime: null,
      endTime: null,
      status: "Unstarted",
      id: user?.uid,
    })
      .then(() => refetch())
      .finally(() => setOpen(false));
  };

  const onDelete = async (id: string) => {
    setIsDeleting(true);
    const promise = deleteDoc(doc(db, "tasks", id))
      .then(() => refetch())
      .finally(() => setIsDeleting(false));

    toast.promise(promise, {
      loading: "Lodaing...",
      success: "Successfully deleted!",
      error: "Someting went wrong!",
    });
  };

  const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return null;
    if (!isCurrentTask) return null;

    const ref = doc(db, "tasks", isCurrentTask.id);
    const promise = updateDoc(ref, {
      title,
    })
      .then(() => refetch())
      .finally(() => setIsEdting(false))
      .catch((e) => console.log(e));

    return promise;
  };

  const onStartingEditing = (task: ITask) => {
    setIsEdting(true);
    setIsCurrentTask(task);
  };
  
  const formatDate = (time: number) => {
    const date = addMilliseconds(new Date(0), time);
    const formattedDate = format(
      addMinutes(date, date.getTimezoneOffset()),
      "HH:mm:ss"
    );

    return formattedDate;
  };
  return (
    <>
      <div className="h-screen max-w-6xl mx-auto flex items-center">
        <div className="grid grid-cols-2 w-full gap-8 items-center">
          <div className="flex flex-col space-y-3">
            <div className="w-full p-4 rounded-md flex justify-between bg-gradient-to-t from-background to-secondary">
              <div className="text-2xl font-bold">Trainings</div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button size={"icon"} onClick={() => setOpen(true)}>
                    <BadgePlus />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Added a new Training</DialogTitle>
                  </DialogHeader>
                  <Separator />
                  <TaskForm
                    handler={
                      onAdd as (
                        values: z.infer<typeof taskSchema>
                      ) => Promise<void | null>
                    }
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
            <div className="w-full p-4 rounded-md flex justify-between bg-gradient-to-b from-background to-secondary relative min-h-60">
              {isPending || (isDeleting && <FillMode />)}
              {error && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {data && (
                <div className="flex flex-col space-y-3 w-full">
                  {!isEdting &&
                    data.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStartingEditing={() => onStartingEditing(task)}
                        onDelete={() => onDelete(task.id)}
                        refetch={refetch}
                      />
                    ))}
                  {isEdting && (
                    <TaskForm
                      title={isCurrentTask?.title}
                      isEdit
                      onClose={() => setIsEdting(false)}
                      handler={
                        onUpdate as (
                          values: z.infer<typeof taskSchema>
                        ) => Promise<void | null>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-3 w-full">
            <div className="p-4 rounded-md bg-gradient-to-r from-blue-900 to-background relative h-24">
              <div className="text-2xl font-bold">Total week</div>
              {isPending ? (
                <FillMode />
              ) : (
                data && (
                  <div className="text-3xl font-bold">
                    {formatDate(data.weekTotal)}
                  </div>
                )
              )}
            </div>
            <div className="p-4 rounded-md bg-gradient-to-r from-secondary to-background relative h-24">
              <div className="text-2xl font-bold">Total month</div>
              {isPending ? (
                <FillMode />
              ) : (
                data && (
                  <div className="text-3xl font-bold">
                    {formatDate(data.monthTotal)}
                  </div>
                )
              )}
            </div>
            <div className="p-4 rounded-md bg-gradient-to-r from-destructive to-background relative h-24">
              <div className="text-2xl font-bold">Total time</div>
              {isPending ? (
                <FillMode />
              ) : (
                data && (
                  <div className="text-3xl font-bold">
                    {formatDate(data.total)}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
