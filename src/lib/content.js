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

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, image, tags, link, github")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load project:", error.message);
    return null;
  }
  return data;
}

export async function getSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("id, group_name, items")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load skills:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCertifications() {
  const { data, error } = await supabase
    .from("certifications")
    .select("id, title, issuer, issued_date, credential_url")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load certifications:", error.message);
    return [];
  }
  return data ?? [];
}