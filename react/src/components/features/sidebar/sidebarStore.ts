/**
 * sidebarのstore useStateでもいいけど、persist試すかもなので、こっちで試してみる
 */
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean,
  toggleSidebar: () => void
}

export const useSidebarState = create<SidebarState>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}))