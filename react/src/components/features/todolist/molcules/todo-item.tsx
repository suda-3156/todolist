import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useCallback, useEffect } from "react"
import { cn } from "@/components/shared/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical, CircleX } from "lucide-react"

import { TodoItemType } from "../type"
import { TodoItemInputSchema, TodoItemSchema } from "../schema/item-schema"


export const TodoItem :React.FC<{item: TodoItemType}> = ({item}: {item: TodoItemType}) => {
  const methods = useForm<TodoItemInputSchema>({
    resolver: zodResolver(TodoItemSchema),
    defaultValues: {
      todo_title: item.todo_title,
      completed:  item.completed,
      deleted:    item.deleted,
      font_color: item.font_color,
      bg_color:   item.bg_color
    },
  })

  // FIXME: APIの実装を待つ
  const sleep = (ms :number) => new Promise((resolve) => setTimeout(resolve, ms))
  const callAPI = useCallback(async () => {
    const request_data = methods.getValues()
    console.log("request_data: ", request_data)
    await sleep(300)
  }, [methods])

  const submit :SubmitHandler<TodoItemInputSchema> = useCallback( async(data) => {
    console.log("submit called:")
    const newTitle = data.todo_title.trim() || "No title"
    if ( data.todo_title === "" ) {
      methods.setValue('todo_title', newTitle)
    }

    // 送信処理.
    await callAPI()
    // TODO: エラー処理 if( isFaileur ...)
  }, [callAPI, methods])
  
  
  // HACK: checkboxやdeleteの値が更新された時に送信処理を行うためにuseEffectする.
  const request_completed = methods.watch("completed")
  const request_deleted = methods.watch("deleted")
  useEffect(() => {
    methods.handleSubmit(submit)()
  }, [methods, request_completed, request_deleted, submit])

  // 色
  const font_color = `#${methods.watch("font_color", "000000")}`
  const bg_color = `#${methods.watch("bg_color", "ffffff")}`

  return (
    <div className="w-full h-12 rounded-lg shadow-md">
      <FormProvider {...methods} >
        <form
          onSubmit={methods.handleSubmit(submit)}
          onBlur={methods.handleSubmit(submit)}
          className={cn("w-full h-full rounded-md px-2 flex justify-center items-center gap-x-1 transition-all focus-within:outline-ring focus-within:ring-ring focus-within:ring-1", methods.formState.errors.todo_title && "border border-red-400 focus-within:ring-red-400")}
          style={{ background: bg_color }}
        >
          <input
            id="completed"
            type="checkbox"
            className="w-5 h-5"
            {...methods.register("completed")}
          />
          <input
            id="todo_title"
            type="text"
            className="w-full h-full px-4 outline-none bg-inherit"
            {...methods.register("todo_title")}
            style={{ color: font_color }}
          />
          <CircleX
            onClick={() => (methods.setValue("deleted", true))}
            className="hover:cursor-pointer"
          />
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical />
            </PopoverTrigger>
            <PopoverContent className="w-[200px] flex flex-col justify-start items-center gap-y-4">
              <div className="w-full h-6 flex justify-center items-center gap-x-1">
                <p className="mr-auto">Text</p>
                <p>#</p>
                <input
                  id="font_color"
                  type="text"
                  className={cn("w-20 h-6 px-1 outline-none border-2 rounded-sm border-gray-300", methods.formState.errors.font_color && "border-red-400")}
                  {...methods.register("font_color")}
                />
                <div
                  className="w-5 h-5 ml-1 border"
                  style={{ "background": `#${methods.watch("font_color")}` }}
                />
              </div>
              <div className="w-full h-6 flex justify-center items-center gap-x-1">
                <p className="mr-auto">Back</p>
                <p>#</p>
                <input
                  id="bg_color"
                  type="text"
                  className={cn("w-20 h-6 px-1 outline-none border-2 rounded-sm border-gray-300", methods.formState.errors.bg_color && "border-red-400")}
                  {...methods.register("bg_color")}
                />
                <div
                  className="w-5 h-5 ml-1 border"
                  style={{ "background": `#${methods.watch("bg_color")}` }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </form>
      </FormProvider>
    </div>
  )
}


