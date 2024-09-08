// import { FC, useEffect, useState } from "react"
// import { Navigate, Outlet } from "react-router-dom"

// interface ProtectedRouteProps {
//   redirectTo: string
// }

// export const ProtectedRoute: FC<ProtectedRouteProps> = ({ redirectTo }) => {
//   const { user } = useAuth()
//   const [ isLoading, setIsLoading ] = useState(true)
//   const setUser = useSetAtom(userAtom)

//   useEffect(() => {
//     const veriveri = async () => {
//       console.log("veriveri")
//       // console.log(isLoading)
//       try {
//         const data = await signAPI.verifyAPI()
//         if (data.responseCd === "1") {
//           setUser(null)
//         } 
//         if (data.responseCd === "0") {
//           setUser(data.user)
//         }
//       } catch (error) {
//         alert(error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     veriveri()
//   },[setUser])


//   if ( isLoading ) {
//     return <Loading />
//   }

//   return !user ? (
//     <Navigate to={redirectTo} replace />
//   ) : (
//     <Outlet />
//   )
// }