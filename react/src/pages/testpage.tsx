import { TodoItem } from "@/components/features/todolist/molcules/todo-item"
import { TodoItemType } from "@/components/features/todolist/type"


export const Test = () => {

  const mockTodo :TodoItemType = {
    todo_id:      "dummy",
    todolist_id:  "dummy",
    user_id:      "dummy",
    todo_title:   "test",
    completed:    false,
    deleted:      false,
    font_color:   "000000",
    bg_color:     "ffffff",
    updatedAt:    new Date()
  }
  

  return (
    <div className='w-full h-full flex justify-center items-center gap-4'>
      <div className="w-[500px] p-5 flex flex-col justify-center items-start gap-y-3 border border-ring rounded-lg">
        <TodoItem item={mockTodo}/>
      </div>
    </div>
  )
}
