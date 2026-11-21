import { create } from "zustand";

type LoadingState = {
  visible: boolean;
  message?: string;
  show: (message?: string) => void;
  hide: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  visible: false,
  message: undefined,
  show: (message) => set({ visible: true, message }),
  hide: () => set({ visible: false, message: undefined }),
}));

export const showLoading = (message?: string) => useLoadingStore.getState().show(message);
export const dismissLoading = () => useLoadingStore.getState().hide();

export async function withLoadingModal<T>(message: string, action: () => Promise<T>) {
  showLoading(message);
  try {
    return await action();
  } finally {
    dismissLoading();
  }
}
