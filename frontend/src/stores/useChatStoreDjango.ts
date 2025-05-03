import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";

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

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL =
  import.meta.env.MODE === "development" ? "ws://localhost:8000" : "/";

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

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Lỗi khi lấy danh sách người dùng",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      const socket = new WebSocket(`${baseURL}/ws/chat/`);

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            event: "user_connected",
            user_id: userId,
          })
        );
        set({ isConnected: true, socket });
      };

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.event === "users_online") {
          set({ onlineUsers: new Set(data.users) });
        } else if (data.event === "user_connected") {
          set((state) => ({
            onlineUsers: new Set([...state.onlineUsers, data.user_id]),
          }));
        } else if (data.event === "user_disconnected") {
          set((state) => {
            const newOnlineUsers = new Set(state.onlineUsers);
            newOnlineUsers.delete(data.user_id);
            return { onlineUsers: newOnlineUsers };
          });
        } else if (data.event === "activities") {
          set({ userActivities: new Map(Object.entries(data.activities)) });
        } else if (data.event === "activity_updated") {
          set((state) => {
            const newActivities = new Map(state.userActivities);
            newActivities.set(data.user_id, data.activity);
            return { userActivities: newActivities };
          });
        } else if (
          data.event === "receive_message" ||
          data.event === "message_sent"
        ) {
          set((state) => ({
            messages: [
              ...state.messages,
              {
                _id: data.message.id, // Renamed to match the Message type
                senderId: data.message.senderId,
                receiverId: data.message.receiverId,
                content: data.message.content,
                createdAt: data.message.createdAt,
                updatedAt: data.message.updatedAt,
              },
            ],
          }));
        } else if (data.event === "message_error") {
          set({ error: data.error });
        }
      };

      socket.onclose = () => {
        set({ isConnected: false, socket: null });
      };

      socket.onerror = () => {
        set({ error: "Lỗi kết nối WebSocket" });
      };
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && get().isConnected) {
      socket.close();
      set({ isConnected: false, socket: null });
    }
  },

  sendMessage: (receiverId, senderId, content) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event: "send_message",
          sender_id: senderId,
          receiver_id: receiverId,
          content,
        })
      );
    }
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Lỗi khi lấy tin nhắn" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
