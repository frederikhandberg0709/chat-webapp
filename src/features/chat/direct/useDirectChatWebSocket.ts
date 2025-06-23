import { User } from "@/types/user";
import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

export interface DirectChatMessage {
  id: number;
  timestamp: string;
  sender: User;
  receiver: User | null;
  directChatId: number;
  content: string;
  readBy: User[];
  createdAt: string;
  updatedAt: string;
  readByCurrentUser: boolean;
}

export interface DirectChatMessageRequest {
  receiverId?: number;
  directChatId?: number;
  content: string;
}

interface UseDirectChatWebSocketProps {
  userId: number;
  onMessageReceived?: (message: DirectChatMessage) => void;
  onError?: (error: Error) => void;
}

export const useDirectChatWebSocket = ({
  userId,
  onMessageReceived,
  onError,
}: UseDirectChatWebSocketProps) => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (clientRef.current?.connected || isConnecting) {
      return;
    }

    setIsConnecting(true);

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

        connectHeaders: {
          // probably need to add auth token
        },

        debug: (str) => {
          console.log("STOMP Debug:", str);
        },

        onConnect: (frame) => {
          console.log("Connected to WebSocket:", frame);
          setIsConnected(true);
          setIsConnecting(false);

          client.subscribe(
            `/user/${userId}/queue/direct-messages`,
            (message) => {
              try {
                const chatMessage: DirectChatMessage = JSON.parse(message.body);
                onMessageReceived?.(chatMessage);
              } catch (error) {
                console.error("Error parsing message:", error);
                onError?.(new Error("Failed to parse incoming message"));
              }
            },
          );
        },

        onStompError: (frame) => {
          console.error("STOMP Error:", frame);
          setIsConnected(false);
          setIsConnecting(false);
          onError?.(new Error(`STOMP Error: ${frame.headers.message}`));
        },

        onWebSocketError: (error) => {
          console.error("WebSocket Error:", error);
          setIsConnected(false);
          setIsConnecting(false);
          onError?.(new Error("WebSocket connection failed"));
        },

        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
          setIsConnected(false);
          setIsConnecting(false);
        },

        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        reconnectDelay: 5000,
      });

      clientRef.current = client;
      client.activate();
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setIsConnecting(false);
      onError?.(error as Error);
    }
  }, [userId, onMessageReceived, onError, isConnecting]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const sendMessage = useCallback(
    (messageRequest: DirectChatMessageRequest) => {
      if (!clientRef.current?.connected) {
        throw new Error("WebSocket is not connected");
      }

      try {
        clientRef.current.publish({
          destination: "/app/direct-message",
          body: JSON.stringify(messageRequest),
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        onError?.(new Error("Failed to send message"));
      }
    },
    [onError],
  );

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
  };
};
