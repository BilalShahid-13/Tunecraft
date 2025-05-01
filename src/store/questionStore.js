import { create } from "zustand";
import { persist } from "zustand/middleware";

const useQuestionStore = create(
  persist(
    (set) => ({
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
      selectedIndex: null,

      addQuestion: (sectionKey, questionData) =>
        set((state) => ({
          questions: {
            ...state.questions,
            [sectionKey]: questionData,
          },
        })),

      setSelected: ({ disabled, index }) => {
        set(() => ({ isButtonDisabled: disabled, selectedIndex: index }));
      },

      reset: () =>
        set(() => ({
          questions: {},
          isButtonDisabled: true,
          selectedIndex: null,
          formData: {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {},
          },
        })),

      onSubmitted: (step, data) => {
        if (step >= 0 && step <= 5) {
          set((state) => ({
            formData: {
              ...state.formData,
              [`step${step}`]: {
                ...state.formData[`step${step}`],
                ...data,
              },
            },
          }));
        } else {
          console.warn("Step must be between 0 and 5.");
        }
      },
    }),
    {
      name: "question-store", // unique name for localStorage key
      // optional: storage: localStorage by default
    }
  )
);

export default useQuestionStore;
