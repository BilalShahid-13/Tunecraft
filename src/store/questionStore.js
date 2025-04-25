import { create } from "zustand";

const useQuestionStore = create((set) => ({
  questions: {},
  isButtonDisabled: true,
  currentStep: 0,
  formData: {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  },
  selectedIndex: null, // ✅ use selectedIndex consistently

  addQuestion: (questionSection) =>
    set((state) => ({
      questions: {
        ...state.questions,
        questionSection,
      },
    })),

  setSelected: ({ disabled, index }) => {
    // if(){}
    set(() => ({ isButtonDisabled: disabled, selectedIndex: index }));
  },

  reset: () =>
    set(() => ({
      questions: {},
      isButtonDisabled: true,
      selectedIndex: 0,
    })),

  onSubmitted: (step, data) => {
    if (step >= 0 && step <= 5) {
      set((state) => ({
        formData: {
          ...state.formData,
          [`step${step}`]: {
            ...state.formData[`step${step}`],
            ...data, // ✅ Merge new data
          },
        },
      }));
    } else {
      console.warn("Step must be between 0 and 5.");
    }
  },
}));

export default useQuestionStore;
