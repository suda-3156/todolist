/**
 * Global Alert Modal
 * 認証にかかわるエラーなどで使う。制御はuseAlertModalStoreから。
*/

import { useAlertModalStore } from "@/store"
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
import { AnimatedDiv } from "../utils/animation"


 
export const AlertModal = () => {
  const { isOpen, title, message, url, isCancenable, closeAlertModal } = useAlertModalStore()
  const navigate = useNavigate()

  const onClickOk = () => {
    navigate(url)
    closeAlertModal()
  }

  return (
    <AnimatedDiv className="fixed top-0 z-[-10] left-0 w-screen h-screen flex justify-center items-center">
      <AlertDialog open={isOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay onClick={isCancenable ? closeAlertModal : undefined }/>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {
                isCancenable && 
                <AlertDialogCancel onClick={closeAlertModal}>Cancel</AlertDialogCancel>
              }
              <AlertDialogAction onClick={onClickOk}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </AnimatedDiv>
  )
}