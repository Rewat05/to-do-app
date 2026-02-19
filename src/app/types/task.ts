export interface Task {
  id: string;
  session_id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}
