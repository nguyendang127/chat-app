export interface messageStructure {
  createAt: any;
  line_text: string;
  user_name: string;
  type?:string;
}

export interface ChatState {
  messages: Array<messageStructure>,
  loading: boolean,
  listRoomChat: Array<RoomChatStructure>,
}

export interface RoomChatStructure {
  RoomName:  string;
  RoomSocketId: string;
}