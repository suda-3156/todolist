

// TODO: サーバー側もtodo-typeを変更する
export type TodoItemType = {
  todo_id:        string,
  todolist_id:    string,
  user_id:        string,
  todo_title:     string,
  completed:      boolean,
  deleted:        boolean,
  font_color:     string,
  bg_color:       string,
  updatedAt:      Date,
}