import { Message, User } from "@/types";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: WebSocket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
  messageError: string | null;
  isChatPage: boolean;

  setIsChatPage: (isChatPage: boolean) => void;
  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (
    receiverId: string,
    senderId: string,
    content: string
  ) => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearMessageError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,
  messageError: null,
  isChatPage: false,

  setIsChatPage: (isChatPage: boolean) => set({ isChatPage }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    console.log("initSocket called with userId:", userId);
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/`);
    set({ socket });

    socket.onopen = () => {
      console.log("WebSocket connected successfully");
      set({ isConnected: true });
      socket.send(
        JSON.stringify({
          event: "user_connected",
          user_id: userId,
        })
      );
    };

    socket.onerror = (error) => {
      console.error("WebSocket connection error:", error);
      set({ isConnected: false });
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.event) {
        case "users_online":
          set({ onlineUsers: new Set(data.users) });
          break;
        case "activities":
          if (Array.isArray(data.activities)) {
            set({ userActivities: new Map(data.activities) });
          } else if (typeof data.activities === "object") {
            set({ userActivities: new Map(Object.entries(data.activities)) });
          }
          break;
        case "user_connected":
          set((state) => ({
            onlineUsers: new Set([...state.onlineUsers, data.user_id]),
          }));
          break;
        case "user_disconnected":
          set((state) => {
            const newOnlineUsers = new Set(state.onlineUsers);
            newOnlineUsers.delete(data.user_id);
            return { onlineUsers: newOnlineUsers };
          });
          break;
        case "receive_message":
          if (data.message) {
            set((state) => ({
              messages: [...state.messages, data.message],
            }));
          }
          break;
        case "message_sent":
          if (data.message) {
            set((state) => ({
              messages: [...state.messages, data.message],
            }));
          }
          break;
        case "activity_updated":
          if (data.user_id && data.activity) {
            set((state) => {
              const newActivities = new Map(state.userActivities);
              newActivities.set(data.user_id, data.activity);
              return { userActivities: newActivities };
            });
          }
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      set({ isConnected: false });
    };
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ isConnected: false, socket: null });
    }
  },

  clearMessageError: () => set({ messageError: null }),

  sendMessage: async (receiverId, senderId, content) => {
    console.log("=== Starting sendMessage ===");
    console.log("Parameters:", { receiverId, senderId, content });
    const socket = get().socket;
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pending: true,
      error: false,
    };
    // 1. Thêm tin nhắn tạm thời vào state
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));
    try {
      set({ messageError: null });
      // 2. Gọi API để lưu tin nhắn vào database
      console.log("1. Saving message to database via API");
      const response = await axiosInstance.post("/users/messages/send/", {
        senderId,
        receiverId,
        content,
      });
      console.log("API Response:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
      // 3. Gửi tin nhắn qua WebSocket nếu cần
      if (socket && socket.readyState === WebSocket.OPEN) {
        const messageData = {
          event: "send_message",
          sender_id: senderId,
          receiver_id: receiverId,
          content: content,
          message: response.data,
        };
        socket.send(JSON.stringify(messageData));
      }
      // 4. Thay thế tin nhắn tạm thời bằng tin nhắn thực tế từ server
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? response.data : msg
        ),
      }));
      console.log("=== Message sent successfully ===");
    } catch (error: any) {
      // Nếu lỗi, cập nhật lại tin nhắn tạm thời thành lỗi
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? { ...msg, pending: false, error: true } : msg
        ),
        messageError: "Không thể gửi tin nhắn. Vui lòng thử lại sau.",
      }));
      console.error("=== Error in sendMessage ===");
      console.error("Error object:", error);
      throw error;
    }
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
