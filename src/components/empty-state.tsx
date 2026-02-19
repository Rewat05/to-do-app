import { ClipboardList } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted p-4 rounded-full mb-4">
        <ClipboardList className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">No tasks yet</h2>
      <p className="text-muted-foreground mt-2">
        Add your first task to get started 🚀
      </p>
    </div>
  );
}
