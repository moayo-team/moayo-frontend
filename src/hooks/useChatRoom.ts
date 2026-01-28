// src/hooks/useChatRoom.ts
import { useEffect, useMemo, useState } from "react";
import { type Message } from "../types/message";
import { StompChatClient } from "../lib/stompChatClient";

type UseChatRoomOptions = {
  roomId?: string;
  wsUrl?: string;        // default 제공
  accessToken?: string;  // 추후 JWT
};

type IncomingMessageDto = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  deletedAt: string | null; // 서버는 보통 string/null
  createdAt: string;
};

function toDate(v: unknown): Date {
  // 서버가 null을 줄 수 있으면 정책 필요. 여기서는 "null이면 epoch"로 처리.
  if (v == null) return new Date(0);
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function mapIncomingToMessage(dto: IncomingMessageDto): Message {
  return {
    id: dto.id,
    chatRoomId: dto.chatRoomId,
    senderId: dto.senderId,
    content: dto.content,
    isDeleted: dto.isDeleted,
    deletedAt: dto.deletedAt ? toDate(dto.deletedAt) : new Date(0),
    createdAt: toDate(dto.createdAt),
  };
}

export function useChatRoom({
  roomId,
  wsUrl = "ws://localhost:8080/ws-chat",
  accessToken,
}: UseChatRoomOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const client = useMemo(() => {
    return new StompChatClient(wsUrl, {
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onError: (e) => console.error("[STOMP ERROR]", e),
    });
  }, [wsUrl]);

  // connect / disconnect lifecycle
  useEffect(() => {
    client.setAccessToken(accessToken);
    client.connect();

    return () => {
      client.disconnect().catch(console.error);
    };
  }, [client, accessToken]);

  // subscribe per room
  useEffect(() => {
    if (!roomId) return;
    if (!connected) return;

    client.subscribeRoom(roomId, (body) => {
      // 서버가 단일 메시지를 보내는 케이스를 기본으로 가정
      // (만약 배열로 보내면 아래 분기에서 처리)
      if (Array.isArray(body)) {
        const mapped = body.map((x) => mapIncomingToMessage(x as IncomingMessageDto));
        setMessages((prev) => [...prev, ...mapped]);
        return;
      }

      const dto = body as IncomingMessageDto;
      const msg = mapIncomingToMessage(dto);

      setMessages((prev) => {
        // 중복 방지(서버 echo + optimistic update 대비)
        if (prev.some((p) => p.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      client.unsubscribe();
    };
  }, [client, roomId, connected]);

  const send = () => {
    if (!roomId) return;

    const content = input.trim();
    if (!content) return;

    // 전송 payload: 백엔드 DTO에 맞춰 조정
    // 기본: content만 전송 (senderId는 서버가 인증/JWT로 판별한다고 가정)
    const payload = { content };

    // 만약 서버가 senderId를 요구하면:
    // const payload = { content, senderId: currentUserId };

    client.publish(roomId, payload);
    setInput("");
  };

  const resetMessages = () => setMessages([]);

  return {
    connected,
    messages,
    input,
    setInput,
    send,
    resetMessages,
  };
}
