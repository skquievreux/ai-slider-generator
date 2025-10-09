import { create } from "zustand";
import { PresentationFormData, Slide, ExportUrls } from "@/types";

interface PresentationState {
  formData: PresentationFormData;
  generatedSlides: Slide[];
  isGenerating: boolean;
  exportUrls: ExportUrls;

  // Actions
  setFormData: (data: Partial<PresentationFormData>) => void;
  setGeneratedSlides: (slides: Slide[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setExportUrls: (urls: ExportUrls) => void;
  reset: () => void;
}

const initialState = {
  formData: {
    topic: "",
    slideCount: 5,
    style: "business",
    templateId: "techeroes-modern-2025",
  },
  generatedSlides: [],
  isGenerating: false,
  exportUrls: {},
};

export const usePresentationStore = create<PresentationState>((set) => ({
  ...initialState,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setGeneratedSlides: (slides) => set({ generatedSlides: slides }),

  setIsGenerating: (generating) => set({ isGenerating: generating }),

  setExportUrls: (urls) => set({ exportUrls: urls }),

  reset: () => set(initialState),
}));
