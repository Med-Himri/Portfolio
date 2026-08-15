import { supabase } from "./supabase";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, image, tags, link, github")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load projects:", error.message);
    return [];
  }
  return data ?? [];
}
