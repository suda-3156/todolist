import { useSidebarState } from "@/components/features/sidebar/sidebarStore"

export const Top = () => {
  const toggleSidebar = useSidebarState((state) => state.toggleSidebar)
  return (
    <div className="w-full h-screen flex items-center justify-center gap-5">
      <button onClick={toggleSidebar}>
        toggle
      </button>
    </div>
  )
}

//TODO: グローバルローディングの使い方を考える。ユーザー名が入ったURLっていいなsoudemonai?? サーバー側のAPI攻勢を整理する