import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { taskSchema } from "@/lib/validation";
import FillMode from "@/pages/fill-mode";
import { useUserState } from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  title?: string;
  isEdit?: boolean;
  onClose?: () => void;
  handler: (values: z.infer<typeof taskSchema>) => Promise<void | null>;
}

const TaskForm = ({ title = "", handler, isEdit, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserState();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title,
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!user) return null;
    setIsLoading(true);
    const promise = handler(values).finally(() => setIsLoading(false));

    toast.promise(promise, {
      loading: "Loading...",
      success: "Successfull",
      error: "Not success",
    });
  }

  return (
    <>
      {isLoading && <FillMode />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a task"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {isEdit && (
              <Button
                type="button"
                disabled={isLoading}
                className=" h-12"
                variant={"destructive"}
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className=" h-12">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;
