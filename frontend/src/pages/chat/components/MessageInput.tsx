import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStoreDjango";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage, messageError, clearMessageError } =
    useChatStore();

  useEffect(() => {
    return () => {
      clearMessageError();
    };
  }, [clearMessageError]);

  const handleSend = async () => {
    // console.log("Sending message", { selectedUser, user, newMessage });
    // if (!selectedUser || !user || !newMessage) return;
    // sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    // setNewMessage("");

    console.log("=== Starting handleSend ===");
    console.log("Current state:", {
      newMessage,
      selectedUser,
      user,
    });

    if (!newMessage.trim()) {
      console.log("Message is empty, returning");
      return;
    }

    if (!selectedUser || !user) {
      console.error("Missing required data:", {
        hasSelectedUser: !!selectedUser,
        hasUser: !!user,
      });
      return;
    }

    try {
      console.log("Calling sendMessage with:", {
        receiverId: selectedUser.clerkId,
        senderId: user.id,
        content: newMessage,
      });

      await sendMessage(selectedUser.clerkId, user.id, newMessage);
      console.log("Message sent successfully");
      setNewMessage("");
    } catch (error: any) {
      console.error("=== Error in handleSend ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      console.error("Request config:", error.config);
    }
  };

  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        {messageError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{messageError}</AlertDescription>
          </Alert>
        )}
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};
export default MessageInput;
