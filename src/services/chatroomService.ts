export type UserData = {
  id: string;
  userName: string;
  userEmail: string;
  roomId: string;
};

export default class ChatRoomService {
  private userList: { [key: string]: UserData };
  private historyMessage: string[];

  constructor() {
    this.userList = {};
    this.historyMessage = [];
  }

  addUser(data: UserData) {
    this.userList[data.id as string] = data;
  }

  removeUser(id: string) {
    if (this.userList[id]) {
      delete this.userList[id];
    }
  }

  getUser(id: string) {
    if (!this.userList[id]) return null;

    const data = this.userList[id];
    if (data) {
      return data;
    }

    return null;
  }
}
