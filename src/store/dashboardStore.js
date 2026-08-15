import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  projects: [],
  isEditorOpen: false,
  editingProject: null, // null while isEditorOpen === true means "creating new"
  status: "idle", // idle | saving | deleting | error
  errorMessage: null,

  setProjects: (projects) => set({ projects }),
  openCreate: () =>
    set({ isEditorOpen: true, editingProject: null, status: "idle", errorMessage: null }),
  openEdit: (project) =>
    set({ isEditorOpen: true, editingProject: project, status: "idle", errorMessage: null }),
  closeEditor: () => set({ isEditorOpen: false, editingProject: null }),
  setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
}));
