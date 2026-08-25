import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { useDashboardStore } from "@/store/dashboardStore";
import { useSkillsStore } from "@/store/skillsStore";
import { useCertificationsStore } from "@/store/certificationsStore";

const emptyProjectForm = {
  title: "",
  description: "",
  image: "",
  tags: "",
  link: "",
  github: "",
};

function projectToForm(p) {
  if (!p) return emptyProjectForm;
  return {
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags.join(", "),
    link: p.link,
    github: p.github,
  };
}

const emptySkillForm = { group_name: "", items: "" };

function skillGroupToForm(s) {
  if (!s) return emptySkillForm;
  return { group_name: s.group_name, items: s.items.join(", ") };
}

const emptyCertificationForm = {
  title: "",
  issuer: "",
  issued_date: "",
  credential_url: "",
};

function certificationToForm(c) {
  if (!c) return emptyCertificationForm;
  return {
    title: c.title,
    issuer: c.issuer,
    issued_date: c.issued_date,
    credential_url: c.credential_url,
  };
}

export default function DashboardPage() {
  const session = useSession();
  const navigate = useNavigate();

  const {
    projects,
    isEditorOpen: isProjectEditorOpen,
    editingProject,
    status: projectStatus,
    errorMessage: projectError,
    setProjects,
    openCreate: openCreateProject,
    openEdit: openEditProject,
    closeEditor: closeProjectEditor,
    setStatus: setProjectStatus,
  } = useDashboardStore();

  const {
    skills,
    isEditorOpen: isSkillEditorOpen,
    editingSkillGroup,
    status: skillStatus,
    errorMessage: skillError,
    setSkills,
    openCreate: openCreateSkill,
    openEdit: openEditSkill,
    closeEditor: closeSkillEditor,
    setStatus: setSkillStatus,
  } = useSkillsStore();

  const {
    certifications,
    isEditorOpen: isCertificationEditorOpen,
    editingCertification,
    status: certificationStatus,
    errorMessage: certificationError,
    setCertifications,
    openCreate: openCreateCertification,
    openEdit: openEditCertification,
    closeEditor: closeCertificationEditor,
    setStatus: setCertificationStatus,
  } = useCertificationsStore();

  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [certificationForm, setCertificationForm] = useState(emptyCertificationForm);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (session) {
      refreshProjects();
      refreshSkills();
      refreshCertifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    setProjectForm(projectToForm(editingProject));
    setImageFile(null);
  }, [editingProject, isProjectEditorOpen]);

  useEffect(() => {
    setSkillForm(skillGroupToForm(editingSkillGroup));
  }, [editingSkillGroup, isSkillEditorOpen]);

  useEffect(() => {
    setCertificationForm(certificationToForm(editingCertification));
  }, [editingCertification, isCertificationEditorOpen]);

  async function refreshProjects() {
    const { data } = await supabase
      .from("projects")
      .select("id, title, description, image, tags, link, github")
      .order("sort_order", { ascending: true });
    setProjects(data ?? []);
  }

  async function refreshSkills() {
    const { data } = await supabase
      .from("skills")
      .select("id, group_name, items")
      .order("sort_order", { ascending: true });
    setSkills(data ?? []);
  }

  async function refreshCertifications() {
    const { data } = await supabase
      .from("certifications")
      .select("id, title, issuer, issued_date, credential_url")
      .order("sort_order", { ascending: true });
    setCertifications(data ?? []);
  }

  // ── Projects ────────────────────────────────────────────────────────────

  async function uploadImageIfNeeded() {
    if (!imageFile) return projectForm.image; // no new file picked, keep existing path/url

    setImageUploading(true);
    const ext = imageFile.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, imageFile, { upsert: false });

    setImageUploading(false);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSaveProject(e) {
    e.preventDefault();
    setProjectStatus("saving");

    try {
      const imageUrl = await uploadImageIfNeeded();

      const tagsArray = projectForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: projectForm.title,
        description: projectForm.description,
        image: imageUrl,
        tags: tagsArray,
        link: projectForm.link || "#",
        github: projectForm.github || "#",
      };

      const query = editingProject
        ? supabase.from("projects").update(payload).eq("id", editingProject.id)
        : supabase.from("projects").insert({ ...payload, sort_order: projects.length + 1 });

      const { error } = await query;
      if (error) throw new Error(error.message);

      await refreshProjects();
      setProjectStatus("idle");
      closeProjectEditor();
    } catch (err) {
      setProjectStatus("error", err.message);
    }
  }

  async function handleDeleteProject(project) {
    const confirmed = window.confirm(`Delete "${project.title}"? This can't be undone.`);
    if (!confirmed) return;

    setProjectStatus("deleting");
    const { error } = await supabase.from("projects").delete().eq("id", project.id);

    if (error) {
      setProjectStatus("error", error.message);
      return;
    }

    await refreshProjects();
    setProjectStatus("idle");
  }

  // ── Skills ──────────────────────────────────────────────────────────────

  async function handleSaveSkill(e) {
    e.preventDefault();
    setSkillStatus("saving");

    const itemsArray = skillForm.items
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = { group_name: skillForm.group_name, items: itemsArray };

    const query = editingSkillGroup
      ? supabase.from("skills").update(payload).eq("id", editingSkillGroup.id)
      : supabase.from("skills").insert({ ...payload, sort_order: skills.length + 1 });

    const { error } = await query;

    if (error) {
      setSkillStatus("error", error.message);
      return;
    }

    await refreshSkills();
    setSkillStatus("idle");
    closeSkillEditor();
  }

  async function handleDeleteSkill(skillGroup) {
    const confirmed = window.confirm(`Delete "${skillGroup.group_name}"? This can't be undone.`);
    if (!confirmed) return;

    setSkillStatus("deleting");
    const { error } = await supabase.from("skills").delete().eq("id", skillGroup.id);

    if (error) {
      setSkillStatus("error", error.message);
      return;
    }

    await refreshSkills();
    setSkillStatus("idle");
  }

  // ── Certifications ──────────────────────────────────────────────────────

  async function handleSaveCertification(e) {
    e.preventDefault();
    setCertificationStatus("saving");

    const payload = {
      title: certificationForm.title,
      issuer: certificationForm.issuer,
      issued_date: certificationForm.issued_date,
      credential_url: certificationForm.credential_url || "#",
    };

    const query = editingCertification
      ? supabase.from("certifications").update(payload).eq("id", editingCertification.id)
      : supabase
          .from("certifications")
          .insert({ ...payload, sort_order: certifications.length + 1 });

    const { error } = await query;

    if (error) {
      setCertificationStatus("error", error.message);
      return;
    }

    await refreshCertifications();
    setCertificationStatus("idle");
    closeCertificationEditor();
  }

  async function handleDeleteCertification(certification) {
    const confirmed = window.confirm(
      `Delete "${certification.title}"? This can't be undone.`
    );
    if (!confirmed) return;

    setCertificationStatus("deleting");
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", certification.id);

    if (error) {
      setCertificationStatus("error", error.message);
      return;
    }

    await refreshCertifications();
    setCertificationStatus("idle");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (session === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-14">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-md px-4 py-2 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects</h2>
            <button
              onClick={openCreateProject}
              className="text-sm bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              + Add project
            </button>
          </div>

          <div className="glass rounded-2xl divide-y divide-border">
            {projects.length === 0 && (
              <p className="p-6 text-muted-foreground text-sm">No projects yet.</p>
            )}
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {p.image && (
                    <img
                      src={p.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-muted-foreground text-sm truncate max-w-md">
                      {p.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditProject(p)}
                    className="text-sm border border-border rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p)}
                    disabled={projectStatus === "deleting"}
                    className="text-sm border border-border rounded-md px-3 py-1.5 text-red-400 hover:border-red-400 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Skills</h2>
            <button
              onClick={openCreateSkill}
              className="text-sm bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              + Add group
            </button>
          </div>

          <div className="glass rounded-2xl divide-y divide-border">
            {skills.length === 0 && (
              <p className="p-6 text-muted-foreground text-sm">No skill groups yet.</p>
            )}
            {skills.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{s.group_name}</p>
                  <p className="text-muted-foreground text-sm truncate max-w-md">
                    {s.items.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditSkill(s)}
                    className="text-sm border border-border rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(s)}
                    disabled={skillStatus === "deleting"}
                    className="text-sm border border-border rounded-md px-3 py-1.5 text-red-400 hover:border-red-400 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Certifications</h2>
            <button
              onClick={openCreateCertification}
              className="text-sm bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              + Add certification
            </button>
          </div>

          <div className="glass rounded-2xl divide-y divide-border">
            {certifications.length === 0 && (
              <p className="p-6 text-muted-foreground text-sm">No certifications yet.</p>
            )}
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.title}</p>
                  <p className="text-muted-foreground text-sm truncate">
                    {c.issuer}
                    {c.issued_date ? ` · ${c.issued_date}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditCertification(c)}
                    className="text-sm border border-border rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(c)}
                    disabled={certificationStatus === "deleting"}
                    className="text-sm border border-border rounded-md px-3 py-1.5 text-red-400 hover:border-red-400 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project editor modal */}
      {isProjectEditorOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-6 z-50">
          <form
            onSubmit={handleSaveProject}
            className="w-full max-w-lg glass rounded-2xl p-6 max-h-[85vh] overflow-y-auto glow-border"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingProject ? "Edit project" : "New project"}
            </h3>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Title
              </label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Description
              </label>
              <textarea
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
                required
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Image
              </label>
              {projectForm.image && !imageFile && (
                <img
                  src={projectForm.image}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg border border-border mb-2"
                />
              )}
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg border border-border mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-border file:bg-surface file:text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editingProject
                  ? "Leave empty to keep the current image."
                  : "Required for a new project."}
              </p>
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={projectForm.tags}
                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Live link (optional)
              </label>
              <input
                type="text"
                value={projectForm.link}
                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                GitHub link (optional)
              </label>
              <input
                type="text"
                value={projectForm.github}
                onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {projectStatus === "error" && projectError && (
              <p className="text-sm text-red-400 mb-3" role="alert">
                {projectError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={projectStatus === "saving" || imageUploading}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {imageUploading
                  ? "Uploading image..."
                  : projectStatus === "saving"
                  ? "Saving..."
                  : "Save"}
              </button>
              <button
                type="button"
                onClick={closeProjectEditor}
                className="px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skill group editor modal */}
      {isSkillEditorOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-6 z-50">
          <form
            onSubmit={handleSaveSkill}
            className="w-full max-w-lg glass rounded-2xl p-6 glow-border"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingSkillGroup ? "Edit skill group" : "New skill group"}
            </h3>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Group name (e.g. Core, Visualization, ML)
              </label>
              <input
                type="text"
                value={skillForm.group_name}
                onChange={(e) => setSkillForm({ ...skillForm, group_name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Skills (comma-separated)
              </label>
              <textarea
                value={skillForm.items}
                onChange={(e) => setSkillForm({ ...skillForm, items: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {skillStatus === "error" && skillError && (
              <p className="text-sm text-red-400 mb-3" role="alert">
                {skillError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={skillStatus === "saving"}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {skillStatus === "saving" ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={closeSkillEditor}
                className="px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certification editor modal */}
      {isCertificationEditorOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-6 z-50">
          <form
            onSubmit={handleSaveCertification}
            className="w-full max-w-lg glass rounded-2xl p-6 glow-border"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingCertification ? "Edit certification" : "New certification"}
            </h3>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Title
              </label>
              <input
                type="text"
                value={certificationForm.title}
                onChange={(e) =>
                  setCertificationForm({ ...certificationForm, title: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Issuer
              </label>
              <input
                type="text"
                value={certificationForm.issuer}
                onChange={(e) =>
                  setCertificationForm({ ...certificationForm, issuer: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Date (e.g. 2025)
              </label>
              <input
                type="text"
                value={certificationForm.issued_date}
                onChange={(e) =>
                  setCertificationForm({ ...certificationForm, issued_date: e.target.value })
                }
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Credential link (optional)
              </label>
              <input
                type="text"
                value={certificationForm.credential_url}
                onChange={(e) =>
                  setCertificationForm({
                    ...certificationForm,
                    credential_url: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {certificationStatus === "error" && certificationError && (
              <p className="text-sm text-red-400 mb-3" role="alert">
                {certificationError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={certificationStatus === "saving"}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {certificationStatus === "saving" ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={closeCertificationEditor}
                className="px-4 py-2 rounded-md border border-border hover:border-primary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
