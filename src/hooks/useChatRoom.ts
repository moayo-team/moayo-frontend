import { useEffect, useMemo, useState } from "react";
import type { Message } from "../types/message";
import { StompChatClient } from "../lib/stompChatClient";

type UseChatRoomOptions = {
  roomId?: string;
  wsUrl?: string;
  accessToken?: string;
  currentUserId: string; // ✅ 추가
};

function toDate(v: unknown): Date {
  if (v == null) return new Date(0);
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function mapIncomingToMessage(dto: any, fallbackRoomId: string): Message {
  return {
    id: dto?.id ?? dto?.messageId ?? `srv_${Date.now()}`,
    chatRoomId: dto?.chatRoomId ?? dto?.chat_room_id ?? fallbackRoomId,
    senderId: dto?.senderId ?? dto?.sender_id ?? "",
    content: dto?.content ?? dto?.message ?? "",
    isDeleted: dto?.isDeleted ?? dto?.is_deleted ?? false,
    deletedAt:
      dto?.deletedAt || dto?.deleted_at
        ? toDate(dto?.deletedAt ?? dto?.deleted_at)
        : new Date(0),
    createdAt: toDate(dto?.createdAt ?? dto?.created_at ?? new Date().toISOString()),
  };
}

export function useChatRoom({
  roomId,
  wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-chat",
  accessToken,
  currentUserId, // ✅
}: UseChatRoomOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const [lastEvent, setLastEvent] = useState<string>("-");
  const [lastError, setLastError] = useState<string>("");

  const client = useMemo(() => {
    return new StompChatClient(wsUrl, {
      onConnected: () => {
        console.log("[STOMP] ✅ connected", wsUrl);
        setConnected(true);
        setLastEvent(`connected: ${wsUrl}`);
      },
      onDisconnected: () => {
        console.log("[STOMP] ⛔ disconnected");
        setConnected(false);
        setLastEvent("disconnected");
      },
      onError: (e) => {
        console.error("[STOMP] ❌ error", e);
        setLastError(String((e as any)?.message ?? e));
        setLastEvent("error");
      },
    });
  }, [wsUrl]);

  useEffect(() => {
    console.log("[STOMP] connect() start", { wsUrl, hasToken: !!accessToken });
    setLastEvent("connecting...");

    client.setAccessToken(accessToken);
    client.connect();

    return () => {
      console.log("[STOMP] disconnect()");
      client.disconnect().catch(console.error);
    };
  }, [client, accessToken, wsUrl]);

  useEffect(() => {
    if (!roomId) {
      console.log("[STOMP] roomId 없음 → 구독 스킵");
      return;
    }
    if (!connected) {
      console.log("[STOMP] 아직 미연결 → 구독대기", { roomId });
      return;
    }

    console.log("[STOMP] 📡 subscribe roomId =", roomId);
    setLastEvent(`subscribe: ${roomId}`);

    client.subscribeRoom(roomId, (body) => {
      console.log("[STOMP] 📩 recv raw:", body);

      if (Array.isArray(body)) {
        const mapped = body.map((x) => mapIncomingToMessage(x, roomId));
        setMessages((prev) => [...prev, ...mapped]);
        setLastEvent(`recv(array): +${mapped.length}`);
        return;
      }

      const msg = mapIncomingToMessage(body, roomId);
      setMessages((prev) => {
        if (prev.some((p) => p.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setLastEvent(`recv: ${msg.id}`);
    });

    return () => {
      console.log("[STOMP] unsubscribe()");
      client.unsubscribe();
    };
  }, [client, roomId, connected]);

  const send = () => {
    if (!roomId) return;

    const content = input.trim();
    if (!content) return;

    // ✅ 내 메시지는 senderId = currentUserId 로 넣어야 오른쪽 버블로 감
    const tempId = `temp_${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      chatRoomId: roomId,
      senderId: currentUserId, // ✅ 여기!
      content,
      isDeleted: false,
      deletedAt: new Date(0),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setLastEvent(`send(optimistic): ${tempId}`);

    const payload = { content };
    console.log("[STOMP] 📤 publish", {
      roomId,
      destination: `/app/chat/rooms/${roomId}`,
      payload,
    });

    try {
      client.publish(roomId, payload);
      setLastEvent(`published: ${roomId}`);
    } catch (e) {
      console.error("[STOMP] publish error", e);
      setLastError(String((e as any)?.message ?? e));
      setLastEvent("publish error");
    }

    setInput("");
  };

  return {
    connected,
    messages,
    input,
    setInput,
    send,
    debug: {
      wsUrl,
      roomId,
      lastEvent,
      lastError,
      messageCount: messages.length,
    },
  };
}
