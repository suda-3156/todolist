import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleHelp } from "lucide-react"

export const GlobalNav = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 p-4 bg-secondary-foreground text-secondary">
      <div className="flex items-center mb-4 space-x-1">
        <Avatar>
          // TODO: DBからの値にする
          <AvatarImage src="https://github.com/suda-3156.png" alt="@suda-3156"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-medium">USERNAME</h1>
      </div>
      <nav className="space-y-2">
        <NavItem/>
      </nav>
    </aside>
  )
}

const NavItem = () => {
  return (
    <button className="w-full h-8 p-2 hovber:bg-gray-200 activa:bg-gray-300 p rounded-lg">
      <CircleHelp className="w-4 h-4"/>
      <span className="text-sm font-medium">NavItem</span>
    </button>
  )
}
