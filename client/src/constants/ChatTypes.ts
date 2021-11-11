export interface messageStructure {
  create_at: any;
  line_text: string;
  user_name: string;

}

export interface ChatState {
  messages: Array<messageStructure>,
  loading: boolean,
}
