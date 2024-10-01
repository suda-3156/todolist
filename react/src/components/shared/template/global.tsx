/**
 * ログイン後のナビゲーションと、メインコンポーネントを入れとく
 * nav : open close 
 */

import { Outlet } from "react-router-dom"

import { AnimatedDiv } from "../wapper/animated-div"
import { Sidebar } from "../../features/sidebar/orgamisms/sidebar"

export const GlobalLayout = () => {
  return (
    <AnimatedDiv className="w-screen h-screen overflow-hidden flex justify-start">
      <Sidebar />
      <div className="h-full flex-grow overflow-auto">
        <Outlet />
      </div>
    </AnimatedDiv>
  )
}




// const NavItem = () => {
//   return (
//     <button className="w-full h-10 p-2 flex items-center space-x-2 text-lg hover:bg-primary/5 active:bg-gray-300 rounded-lg transition-all">
//       <CircleHelp size={20}/>
//       <span className="font-medium">NavItem</span>
//     </button>
//   )
// }



