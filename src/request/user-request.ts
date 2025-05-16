export type loginRequest = {
  email: string;
  password: string;
};
export type CreateUserRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  fullName?: string;
  email?: string;
  password?: string;
};

export type ListUserRequest = {
  page: number;
  take: number;
  skip: number;
  name?: string;
};
