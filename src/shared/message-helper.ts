import { ConversationMessage } from "../features/chat/chatSlice";

export function createInitialConversationMessage(newConversationMessage: string): ConversationMessage {
  const dateTime = new Date();

  return { 
    id: 0, 
    conversationId: 0, 
    message: newConversationMessage, 
    createdAt: dateTime.toDateString(), 
    createdAtTime: dateTime.toTimeString(), 
    is_system: 1, 
    Sender: { username: '', avatar: '' }, 
    Receiver: { username: '', avatar: '' } 
  };
}