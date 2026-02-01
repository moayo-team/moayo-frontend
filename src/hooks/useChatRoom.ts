// src/hooks/useChatRoom.ts
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "../types/message";
import { apiClient } from "../lib/apiClient";
import { StompChatClient } from "../lib/stompChatClient"; // ✅ 네가 올린 클래스 파일 경로로 맞춰

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: T;
};

type DebugState = {
  roomId: number | null;
  lastEvent: string;
  lastError: string;
  messageCount: number;
};

type UseChatRoomOptions = {
  roomId: number | null;
  wsUrl?: string;
  accessToken?: string;
};

export function useChatRoom({
  roomId,
  wsUrl = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_WS_ENDPOINT}`,
  accessToken = localStorage.getItem("accessToken") ?? import.meta.env.VITE_MOAYO_ACCESS_TOKEN,
}: UseChatRoomOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [connected, setConnected] = useState(false);
  const [debug, setDebug] = useState<DebugState>({
    roomId,
    lastEvent: "-",
    lastError: "",
    messageCount: 0,
  });

  const clientRef = useRef<StompChatClient | null>(null);

  // messages 길이 -> debug 동기화
  useEffect(() => {
    setDebug((d) => ({ ...d, messageCount: messages.length }));
  }, [messages.length]);

  // ✅ 1) STOMP 클라이언트 생성 + 연결 (wsUrl/accessToken 바뀌면 재연결)
  useEffect(() => {
    setDebug((d) => ({ ...d, lastEvent: "stomp init...", lastError: "" }));
    setConnected(false);

    const client = new StompChatClient(wsUrl, {
      onConnected: () => {
        setConnected(true);
        setDebug((d) => ({ ...d, lastEvent: "connected" }));
      },
      onDisconnected: () => {
        setConnected(false);
        setDebug((d) => ({ ...d, lastEvent: "disconnected" }));
      },
      onError: (e) => {
        setConnected(false);
        setDebug((d) => ({
          ...d,
          lastEvent: "stomp error",
          lastError: String((e as any)?.message ?? e),
        }));
      },
    });

    client.setAccessToken(accessToken);
    client.connect();

    clientRef.current = client;

    return () => {
      setDebug((d) => ({ ...d, lastEvent: "stomp cleanup..." }));
      client.disconnect().catch((e) => {
        setDebug((d) => ({
          ...d,
          lastEvent: "disconnect error",
          lastError: String((e as any)?.message ?? e),
        }));
      });
      clientRef.current = null;
      setConnected(false);
    };
  }, [wsUrl, accessToken]);

  // ✅ 2) roomId가 바뀌면: REST 히스토리 로드 + STOMP 구독
  useEffect(() => {
    const client = clientRef.current;

    if (!roomId) {
      setDebug((d) => ({ ...d, roomId: null, lastEvent: "idle(no roomId)" }));
      // 방이 없으면 구독 해제
      client?.unsubscribe();
      setMessages([]);
      return;
    }

    setDebug((d) => ({ ...d, roomId, lastEvent: "room changed", lastError: "" }));
    setMessages([]); // 선택: 방 바뀔 때 화면 초기화

    let cancelled = false;

    // (A) REST: 과거 메시지 조회
    const fetchHistory = async () => {
      try {
        setDebug((d) => ({ ...d, lastEvent: "fetchHistory..." }));

        //http get요청
        const res = await apiClient.get<ApiEnvelope<ChatMessage[]>>(
          `/api/chat/rooms/${roomId}/messages`
        );

        const list = res.data.result ?? [];
        // createdAt 오름차순 정렬
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        if (!cancelled) {
          setMessages(list);
          setDebug((d) => ({ ...d, lastEvent: `history loaded: ${list.length}` }));
        }
      } catch (e: any) {
        if (!cancelled) {
          setDebug((d) => ({
            ...d,
            lastEvent: "history error",
            lastError: String(e?.message ?? e),
          }));
        }
      }
    };

    // (B) STOMP: 연결된 상태면 구독
    // 연결이 아직 안 됐을 수 있으니 connected가 true일 때만 subscribe
    if (connected && client) {
      setDebug((d) => ({ ...d, lastEvent: `subscribe: ${roomId}` }));

      client.subscribeRoom(String(roomId), (body) => {
        // body가 배열/단건 둘 다 올 수 있게 방어
        const incoming: ChatMessage[] = Array.isArray(body) ? body : [body];

        setMessages((prev) => {
          const map = new Map<number, ChatMessage>();
          // 기존
          for (const m of prev) map.set(m.id, m);
          // 신규
          for (const m of incoming) {
            if (m && typeof m.id === "number") map.set(m.id, m);
          }

          const merged = Array.from(map.values());
          merged.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          return merged;
        });

        const lastId = Array.isArray(body) ? "array" : (body?.id ?? "?");
        setDebug((d) => ({ ...d, lastEvent: `recv: ${lastId}` }));
      });
    } else {
      setDebug((d) => ({ ...d, lastEvent: "waiting connection to subscribe..." }));
    }

    fetchHistory();

    return () => {
      cancelled = true;
      client?.unsubscribe();
    };
  }, [roomId, connected]);

  // ✅ 3) 전송
  const send = () => {
    const content = input.trim();
    if (!content || !roomId) return;

    const client = clientRef.current;
    if (!client) {
      setDebug((d) => ({ ...d, lastEvent: "send blocked(no client)" }));
      return;
    }

    try {
      client.publish(String(roomId), { content });
      setDebug((d) => ({ ...d, lastEvent: "published" }));
      setInput("");
    } catch (e: any) {
      setDebug((d) => ({
        ...d,
        lastEvent: "publish error",
        lastError: String(e?.message ?? e),
      }));
    }
  };

  return {
    connected,
    debug,
    messages,
    input,
    setInput,
    send,
  };
}
