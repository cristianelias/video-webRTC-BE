import { User } from "./types";

export class UsersStore {
  users: User[];

  constructor() {
    this.users = [];
  }

  addUser(user: User) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
