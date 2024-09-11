
export const Loading = () => {
  return (
    <div className="z-[9000] fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-20">
      <div className="flex justify-center my-20">
        <div
          className="w-10 h-10 rounded-full border-4 border-primary animate-spin"
          style={{ borderTopColor: 'transparent' }}
        />
      </div>
    </div>
)}