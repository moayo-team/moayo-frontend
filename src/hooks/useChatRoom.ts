import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/message";
import { apiClient } from "../lib/apiClient";
import { StompChatClient } from "../lib/stompChatClient";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp?: string;
  result: T;
};

type DebugState = {
  roomId: number | null;
  meId: number | null;
  lastEvent: string;
  lastError: string;
  messageCount: number;
  wsUrl: string;
};

type UseChatRoomOptions = {
  roomId: number | null;
  currentUserId?: number;
  wsUrl?: string;
  accessToken?: string;
};

export function useChatRoom({
  roomId,
  currentUserId,
  wsUrl = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}${
    import.meta.env.VITE_WS_ENDPOINT ?? "/ws-chat"
  }`,
  accessToken =
    localStorage.getItem("accessToken") ??
    (import.meta.env.VITE_MOAYO_ACCESS_TOKEN as string | undefined),
}: UseChatRoomOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  const [meId, setMeId] = useState<number | null>(
    typeof currentUserId === "number" && Number.isFinite(currentUserId) ? currentUserId : null
  );

  const [debug, setDebug] = useState<DebugState>({
    roomId,
    meId: null,
    lastEvent: "-",
    lastError: "",
    messageCount: 0,
    wsUrl,
  });

  const clientRef = useRef<StompChatClient | null>(null);

  useEffect(() => {
    setDebug((d) => ({
      ...d,
      roomId,
      meId,
      messageCount: messages.length,
      wsUrl,
    }));
  }, [roomId, meId, messages.length, wsUrl]);

  useEffect(() => {
    if (typeof currentUserId === "number" && Number.isFinite(currentUserId)) {
      setMeId(currentUserId);
      setDebug((d) => ({ ...d, meId: currentUserId, lastEvent: "meId from props" }));
      return;
    }

    let cancelled = false;

    const fetchMe = async () => {
      try {
        setDebug((d) => ({ ...d, lastEvent: "fetch meId...", lastError: "" }));
        const res = await apiClient.get<ApiEnvelope<{ id: number; email: string; name: string }>>(
          "/api/v1/users/me"
        );
        const id = Number(res.data?.result?.id);
        if (!Number.isFinite(id)) throw new Error(`invalid me id: ${String(res.data?.result?.id)}`);

        if (!cancelled) {
          setMeId(id);
          setDebug((d) => ({ ...d, meId: id, lastEvent: `meId loaded: ${id}` }));
        }
      } catch (e: any) {
        if (!cancelled) {
          setMeId(null);
          setDebug((d) => ({
            ...d,
            meId: null,
            lastEvent: "fetch meId error",
            lastError: String(e?.message ?? e),
          }));
        }
      }
    };

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

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
      try {
        client.unsubscribe();
      } catch {
        // ignore
      }
      client
        .disconnect()
        .catch((e) => {
          setDebug((d) => ({
            ...d,
            lastEvent: "disconnect error",
            lastError: String((e as any)?.message ?? e),
          }));
        })
        .finally(() => {
          clientRef.current = null;
          setConnected(false);
        });
    };
  }, [wsUrl, accessToken]);

  const fetchHistory = useCallback(async () => {
    if (!roomId) return;

    try {
      setDebug((d) => ({ ...d, lastEvent: "fetchHistory...", lastError: "" }));
      const res = await apiClient.get<ApiEnvelope<ChatMessage[]>>(
        `/api/v1/chat/rooms/${roomId}/messages`
      );

      const list = res.data.result ?? [];
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages(list);
      setDebug((d) => ({ ...d, lastEvent: `history loaded: ${list.length}` }));
    } catch (e: any) {
      setDebug((d) => ({
        ...d,
        lastEvent: "history error",
        lastError: String(e?.message ?? e),
      }));
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setDebug((d) => ({ ...d, roomId: null, lastEvent: "idle(no roomId)" }));
      return;
    }

    setMessages([]);
    fetchHistory();
  }, [roomId, fetchHistory]);

  useEffect(() => {
    const client = clientRef.current;

    if (!roomId) {
      client?.unsubscribe();
      return;
    }
    if (!client || !connected) {
      setDebug((d) => ({ ...d, lastEvent: "waiting connection to subscribe..." }));
      return;
    }

    setDebug((d) => ({ ...d, lastEvent: `subscribe: ${roomId}`, lastError: "" }));

    try {
      client.unsubscribe();
    } catch {
      // ignore
    }

    client.subscribeRoom(String(roomId), (body) => {
      const incoming: ChatMessage[] = Array.isArray(body) ? body : [body];

      setMessages((prev) => {
        const map = new Map<string, ChatMessage>();
        for (const m of prev) map.set(String(m.messageId), m);
        for (const m of incoming) {
          if (m && m.messageId != null) map.set(String(m.messageId), m);
        }
        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return merged;
      });

      const lastId = Array.isArray(body) ? "array" : body?.id ?? "?";
      setDebug((d) => ({ ...d, lastEvent: `recv: ${String(lastId)}` }));
    });

    return () => {
      try {
        client.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, [roomId, connected]);

  const sendText = useCallback(
    async (content: string, roomIdOverride?: number) => {
      const text = content.trim();
      const targetRoomId = roomIdOverride ?? roomId;
      if (!text || !targetRoomId) return;

      if (sending) return;
      setSending(true);

      const tempId = -Date.now();

      try {
        if (!meId) throw new Error("meId is null (check /api/v1/users/me)");

        const temp: ChatMessage = {
          messageId: tempId,
          chatRoomId: targetRoomId,
          senderId: meId,
          content: text,
          createdAt: new Date().toISOString(),
          isDeleted: false,
          deletedAt: null,
        };

        setMessages((prev) => {
          const next = [...prev, temp];
          next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          return next;
        });

        const client = clientRef.current;
        if (!connected || !client) {
          setDebug((d) => ({ ...d, lastEvent: "send blocked(not connected)" }));
          setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
          return;
        }

        await client.publish(String(targetRoomId), { content: text });
        setDebug((d) => ({ ...d, lastEvent: `published(room:${targetRoomId})` }));

        await fetchHistory();
      } catch (e: any) {
        setDebug((d) => ({
          ...d,
          lastEvent: "send error",
          lastError: String(e?.message ?? e),
        }));
      } finally {
        setSending(false);
      }
    },
    [roomId, meId, connected, fetchHistory, sending]
  );

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !roomId) return;
    setInput("");
    await sendText(text, roomId);
  }, [input, roomId, sendText]);

  return {
    connected,
    sending,
    debug,
    meId,
    messages,
    input,
    setInput,
    send,
    sendText,
    refetchMessages: fetchHistory,
  };
}
