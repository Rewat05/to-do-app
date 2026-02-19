"use client";

import { useState } from "react";
import { updateTask } from "@/app/actions/task-actions";
import { Task } from "@/types/task";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  task: Task;
}

export default function EditTaskDialog({ task }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        {/* Server Action Form */}
        <form
          action={async (formData: FormData) => {
            await updateTask(formData);
            setOpen(false); // close dialog after update
          }}
          className="space-y-4"
        >
          {/* Hidden ID */}
          <input type="hidden" name="id" value={task.id} />

          {/* Title */}
          <div>
            <Input
              name="title"
              defaultValue={task.title}
              placeholder="Task Title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              name="description"
              defaultValue={task.description}
              placeholder="Task Description"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
