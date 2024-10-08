/**
 * Global Alert Modal
 * 認証にかかわるエラーなどで使う。制御はuseAlertModalStoreから。
*/
// TODO: cancelボタンを押したときの振る舞いについて、考える

import { useAlertModalStore } from "./alertModalStore"
import { useNavigate } from "react-router-dom"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
  AlertDialogPortal
} from "@/components/ui/alert-dialog"
import { AnimatedDiv } from "@/components/shared/wapper/animated-div"


 
export const AlertModal = () => {

  const isOpen = useAlertModalStore((state) => state.isOpen)
  const closeAlertModal = useAlertModalStore((state) => state.closeAlertModal)
  const getSettings = useAlertModalStore((state) => state.getSettings)

  const navigate = useNavigate()

  const settings = getSettings()

  const onClickOk = () => {
    const url = settings.url
    if ( url !== ""){
      navigate(url)
    }
    closeAlertModal()
  }

  return (
    <AnimatedDiv className="fixed top-0 z-[-10] left-0 w-screen h-screen flex justify-center items-center">
      <AlertDialog open={isOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay onClick={settings.isCancenable ? closeAlertModal : undefined }/>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">{settings.title}</AlertDialogTitle>
              <AlertDialogDescription>{settings.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {
                settings.isCancenable && 
                <AlertDialogCancel onClick={closeAlertModal}>Cancel</AlertDialogCancel>
              }
              <AlertDialogAction onClick={onClickOk} className="text-background font-semibold">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </AnimatedDiv>
  )
}