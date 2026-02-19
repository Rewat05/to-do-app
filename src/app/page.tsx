import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Task Manager
          </h1>
        </div>

        {/* Form */}
        <TaskForm />

        {/* Task List */}
        <TaskList />
      </div>
    </main>
  );
}
