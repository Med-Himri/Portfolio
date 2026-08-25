import { create } from "zustand";

export const useCertificationsStore = create((set) => ({
  certifications: [],
  isEditorOpen: false,
  editingCertification: null, // null while isEditorOpen === true means "creating new"
  status: "idle", // idle | saving | deleting | error
  errorMessage: null,

  setCertifications: (certifications) => set({ certifications }),
  openCreate: () =>
    set({
      isEditorOpen: true,
      editingCertification: null,
      status: "idle",
      errorMessage: null,
    }),
  openEdit: (certification) =>
    set({
      isEditorOpen: true,
      editingCertification: certification,
      status: "idle",
      errorMessage: null,
    }),
  closeEditor: () => set({ isEditorOpen: false, editingCertification: null }),
  setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
}));
