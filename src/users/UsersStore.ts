import { getTimeStamp } from "../utils/date";
import { User } from "./types";

export class UsersStore {
  users: User[];

  constructor() {
    this.users = [];
  }

  addUser(username: string, socketId: string) {
    this.users.push({
      name: username,
      id: socketId,
      joinedAt: getTimeStamp(),
    });
  }

  getUsers() {
    return this.users;
  }

  getFilteredUsers(excludedId: string) {
    return this.users.filter((user) => user.id !== excludedId);
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
