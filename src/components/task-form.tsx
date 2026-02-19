"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/lib/validation";
import { createTask } from "@/app/actions/task-actions";
import { getSessionId } from "@/lib/session";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaskForm() {
  const {
    register,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  const session_id = typeof window !== "undefined" ? getSessionId() : null;

  return (
    <Card className="mb-8 border-0 shadow-xl bg-white/70 backdrop-blur dark:bg-zinc-900/70">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>

      <CardContent>
        {/* IMPORTANT: Using Server Action directly */}
        <form action={createTask} className="space-y-5">
          {/* Hidden session field */}
          <input type="hidden" name="session_id" value={session_id || ""} />

          {/* Title */}
          <div>
            <Input
              placeholder="Task Title"
              {...register("title")}
              name="title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Textarea
              placeholder="Task Description"
              {...register("description")}
              name="description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Image</label>

              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full text-sm 
 file:mr-4 file:py-2 file:px-4
 file:rounded-lg file:border file:border-black
 file:text-sm file:font-semibold
 file:bg-black file:text-white
 hover:file:bg-zinc-800
 file:cursor-pointer cursor-pointer
 border border-zinc-300 rounded-lg p-2 bg-white
 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
