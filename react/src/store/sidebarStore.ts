/**
 * sidebarのstore useStateでもいいけど、persist試すかもなので、こっちで試してみる
 */
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
}

export const useSidebarState = create<SidebarState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set(() => ({ isOpen: isOpen }))
}))