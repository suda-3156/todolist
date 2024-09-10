
export type UserType = {
  name: string,
  email: string,
  role: "USER" | "ADMIN"
}

export type TokenType = {
  accessToken: string
}

export type Password = {
  password: string,
  confirmPassword?: string
}

// export type TodoType = {
//   itemId: string;
//   title: string;
//   completed: boolean;
//   deleted: boolean;
//   authorId: string;
// }


// export type TodoResponse = SuccessResponse & {
//   todo: TodoType
// }


// export type TodoListResponse = SuccessResponse & {
//   todolist: TodoType[]
// }