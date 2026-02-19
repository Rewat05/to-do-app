"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {

  console.log("SERVER ACTION TRIGGERED");
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const session_id = formData.get("session_id") as string;
    const image = formData.get("image") as File | null;

    console.log("FormData received:", {
  title,
  description,
  session_id,
  image,
});


    let image_url: string | null = null;

    // Upload image if exists
    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;

      const { data, error } = await supabase.storage
        .from("task-images")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("task-images")
        .getPublicUrl(data.path);

      image_url = publicUrl.publicUrl;
    }

    const { data, error } = await supabase.from("tasks").insert([
  {
    title,
    description,
    session_id,
    image_url,
  },
]);

console.log("Insert data:", data);
console.log("Insert error:", error);

if (error) {
  console.error("Supabase insert error:", error);
  throw error;
}


    revalidatePath("/");
  } catch (err) {
    console.error("Create task error:", err);
    throw err;
  }
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
}

export async function getTasks(session_id: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("session_id", session_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateTask(formData: FormData) {
  console.log("UPDATE TASK TRIGGERED");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!id) throw new Error("Task ID is required");

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
    })
    .eq("id", id);

  if (error) {
    console.error("Update task error:", error);
    throw error;
  }

  revalidatePath("/");
}

