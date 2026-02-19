"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTasks, deleteTask } from "@/app/actions/task-actions";
import { getSessionId } from "@/lib/session";
import { Task } from "@/types/task";
import EditTaskDialog from "@/components/edit-task-dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const session_id = typeof window !== "undefined" ? getSessionId() : null;

  // Initial Fetch
  const fetchTasks = async () => {
    if (!session_id) return;
    const data = await getTasks(session_id);
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!session_id) return;

    // Initial load
    fetchTasks();

    // 🔥 REALTIME SUBSCRIPTION
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          console.log("Realtime event:", payload);

          // Refetch tasks when any change happens
          fetchTasks();
        },
      )
      .subscribe();

    // Cleanup (important)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session_id]);

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    // No manual fetch needed now (realtime will update)
  };

  if (loading) return <p>Loading tasks...</p>;

  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-zinc-900/80 backdrop-blur"
        >
          <CardContent className="p-5">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 bg-muted/20 border rounded-xl flex items-center justify-center overflow-hidden">
                  {task.image_url ? (
                    <img
                      src={task.image_url}
                      alt="Task"
                      className="max-w-full max-h-full object-contain p-2 transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No Image
                    </span>
                  )}
                </div>
              </div>

              {/* 📄 Content (Right Side) */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold leading-tight">
                    {task.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <EditTaskDialog task={task} />
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
