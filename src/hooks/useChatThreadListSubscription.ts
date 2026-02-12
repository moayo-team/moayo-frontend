import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatRoomSummary } from "../types/message";

function sortRooms(list: ChatRoomSummary[]) {
   return [...list].sort((a, b) => {
      const at = a.lastMessageCreatedAt ? new Date(a.lastMessageCreatedAt).getTime() : 0;
      const bt = b.lastMessageCreatedAt ? new Date(b.lastMessageCreatedAt).getTime() : 0;
      if (bt !== at) return bt - at;
      return (b.roomId ?? 0) - (a.roomId ?? 0);
   });
}

export function useChatThreadListSubscription({
   myUserId,
   activeRoomId,
   setRooms
}: {
   myUserId: number | null;
   activeRoomId: number | null;
   setRooms: React.Dispatch<React.SetStateAction<ChatRoomSummary[]>>;
}) {
   const activeRoomIdRef = useRef<number | null>(activeRoomId);
   useEffect(() => {
      activeRoomIdRef.current = activeRoomId;
   }, [activeRoomId]);

   useEffect(() => {
      if (!myUserId) return;

      const wsUrl = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}${
         import.meta.env.VITE_WS_ENDPOINT ?? "/ws-chat"
      }`;

      const accessToken =
         localStorage.getItem("accessToken") ??
         (import.meta.env.VITE_MOAYO_ACCESS_TOKEN as string | undefined);

      const socket = new SockJS(wsUrl);

      const client = new Client({
         webSocketFactory: () => socket as any,
         reconnectDelay: 3000,
         connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      client.onConnect = () => {
         client.subscribe(`/topic/chat/threads/${myUserId}`, (msg) => {
            const raw = JSON.parse(msg.body);
            const event = (raw?.result ?? raw) as ChatRoomSummary;

            const normalizeRoomId = (v: unknown) => Number(v);
            const eventRoomId = normalizeRoomId(event.roomId);
            const currentActiveRoomId = activeRoomIdRef.current;

            setRooms((prev) => {
               const list = prev ? [...prev] : [];
               const idx = list.findIndex((x) => normalizeRoomId(x.roomId) === eventRoomId);

               const merge = (base: ChatRoomSummary): ChatRoomSummary => ({
                  ...base,
                  ...event,
                  hasUnread: currentActiveRoomId === eventRoomId ? false : (event.hasUnread ?? base.hasUnread)
               });

               if (idx >= 0) {
                  list[idx] = merge(list[idx]);
               } else {
                  list.push(event);
               }

               return sortRooms(list);
            });
         });
      };

      client.activate();

      return () => {
         client.deactivate();
      };
   }, [myUserId, setRooms]);
}
