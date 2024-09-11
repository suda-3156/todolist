/**
 * アラートモーダルのstore
 */

import { create } from "zustand"

// TODO: alertmodalversion 的なので、番号によって、特定の形でモーダルを呼べるようにする。
// TODO: この場合、storeをalertmodalのところに移すべきか

interface AlertModalState {
  isOpen: boolean,
  title: string,
  message: string,
  url: string,
  isCancenable: boolean,
  openAlertModal: () => void,
  closeAlertModal: () => void,
  setAlertModal: ({ title, message, url, isCancenable }: { title: string, message: string, url: string, isCancenable: boolean }) => void
}

export const useAlertModalStore = create<AlertModalState>((set) => ({
  isOpen: false,
  title: "Notification",
  message: "An unexpected error has occurred. Please try again later.",
  url: "/login",
  isCancenable: false,
  openAlertModal: () => set(() => ({ isOpen: true })),
  // TODO: titleなどリセットしたいけど、モーダル閉じる瞬間に変化するのはやだ。
  closeAlertModal: () => set(() => ({ isOpen: false/*, title: "Notification", message: "An unexpected error has occurred. Please try again later.", url: "/top"*/ })),
  // resetAlertModal: () => set(() => ({ title: "Notification", message: "An unexpected error has occurred. Please try again later.", url: "/top" })),
  setAlertModal: ({ title, message, url, isCancenable }) => set(() => ({ title: title, message: message, url: url, isCancenable: isCancenable }))
}))