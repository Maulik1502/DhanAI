'use client';

import { create } from 'zustand';

type OnboardingDraft = Record<string, unknown>;

type AppStore = {
  sidebarOpen: boolean;
  alertPanelOpen: boolean;
  adminMode: boolean;
  onboardingStep: number;
  onboardingDraft: OnboardingDraft;
  setSidebarOpen: (value: boolean) => void;
  setAlertPanelOpen: (value: boolean) => void;
  setAdminMode: (value: boolean) => void;
  setOnboardingStep: (step: number) => void;
  updateOnboardingDraft: (patch: OnboardingDraft) => void;
  resetOnboarding: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: false,
  alertPanelOpen: false,
  adminMode: false,
  onboardingStep: 0,
  onboardingDraft: {},
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setAlertPanelOpen: (alertPanelOpen) => set({ alertPanelOpen }),
  setAdminMode: (adminMode) => set({ adminMode }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  updateOnboardingDraft: (patch) => set((state) => ({ onboardingDraft: { ...state.onboardingDraft, ...patch } })),
  resetOnboarding: () => set({ onboardingStep: 0, onboardingDraft: {} }),
}));
