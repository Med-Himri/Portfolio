import { create } from "zustand";

export const useSkillsStore = create((set) => ({
  skills: [],
  isEditorOpen: false,
  editingSkillGroup: null, // null while isEditorOpen === true means "creating new"
  status: "idle", // idle | saving | deleting | error
  errorMessage: null,

  setSkills: (skills) => set({ skills }),
  openCreate: () =>
    set({ isEditorOpen: true, editingSkillGroup: null, status: "idle", errorMessage: null }),
  openEdit: (skillGroup) =>
    set({ isEditorOpen: true, editingSkillGroup: skillGroup, status: "idle", errorMessage: null }),
  closeEditor: () => set({ isEditorOpen: false, editingSkillGroup: null }),
  setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
}));
