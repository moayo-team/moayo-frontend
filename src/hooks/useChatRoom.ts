import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/message";
import { apiClient } from "../lib/apiClient";

import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type ApiEnvelope<T> = {
	isSuccess: boolean;
	code: string;
	message: string;
	timestamp?: string;
	result: T;
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
	wsUrl = `${
		import.meta.env.VITE_API_BASE_URL ??
		(typeof window !== "undefined" ? window.location.origin : "")
	}${import.meta.env.VITE_WS_ENDPOINT ?? "/ws-chat"}`,
	accessToken =
		localStorage.getItem("accessToken") ??
		(import.meta.env.VITE_MOAYO_ACCESS_TOKEN as string | undefined)
}: UseChatRoomOptions) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");

	const [connected, setConnected] = useState(false);
	const [sending, setSending] = useState(false);

	const [meId, setMeId] = useState<number | null>(
		typeof currentUserId === "number" && Number.isFinite(currentUserId)
			? currentUserId
			: null
	);

	const clientRef = useRef<Client | null>(null);
	const subRef = useRef<StompSubscription | null>(null);

	// 내 userId 세팅 (props 우선, 없으면 /users/me 호출)
	useEffect(() => {
		if (typeof currentUserId === "number" && Number.isFinite(currentUserId)) {
			setMeId(currentUserId);
			return;
		}
		let cancelled = false;

		const fetchMe = async () => {
			try {
				const res = await apiClient.get<
					ApiEnvelope<{ id: number; email: string; name: string }>
				>("/api/v1/users/me");

				const id = Number(res.data?.result?.id);
				if (!Number.isFinite(id)) return;

				if (!cancelled) {
					setMeId(id);
				}
			} catch {
				if (!cancelled) {
					setMeId(null);
				}
			}
		};
		fetchMe();

		return () => {
			cancelled = true;
		};
	}, [currentUserId]);

	// STOMP 클라이언트 생성 + 연결
	useEffect(() => {
		setConnected(false);

		const client = new Client({
			webSocketFactory: () => new SockJS(wsUrl),
			reconnectDelay: 3000,
			connectHeaders: accessToken
				? { Authorization: `Bearer ${accessToken}` }
				: {},
			debug: () => {},
			onConnect: () => {
				setConnected(true);
			},
			onDisconnect: () => {
				setConnected(false);
			}
		});

		clientRef.current = client;
		client.activate();

		return () => {
			try {
				subRef.current?.unsubscribe();
				subRef.current = null;
			} catch {
				// ignore
			}

			client.deactivate().catch(() => {});
			clientRef.current = null;
			setConnected(false);
		};
	}, [wsUrl, accessToken]);

	// 과거 메시지 불러오기
	const fetchHistory = useCallback(async () => {
		if (!roomId) {
			setMessages([]);
			return;
		}

		try {
			const res = await apiClient.get<ApiEnvelope<ChatMessage[]>>(
				`/api/v1/chat/rooms/${roomId}/messages`
			);

			const list = res.data.result ?? [];
			list.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
			setMessages(list);
		} catch {
			// 에러 나면 그냥 그대로 둠
		}
	}, [roomId]);

	// roomId 바뀔 때마다 히스토리 리로드
	useEffect(() => {
		if (!roomId) {
			setMessages([]);
			return;
		}

		setMessages([]);
		fetchHistory();
	}, [roomId, fetchHistory]);

	// 방 구독 (실시간 수신)
	useEffect(() => {
		const client = clientRef.current;
		if (!roomId) {
			subRef.current?.unsubscribe();
			subRef.current = null;
			return;
		}
		if (!client || !connected) {
			return;
		}

		try {
			subRef.current?.unsubscribe();
		} catch {
			// ignore
		}

		const topic = `/topic/chat/rooms/${roomId}`;
		const sub = client.subscribe(topic, (msg: IMessage) => {
			try {
				const body = JSON.parse(msg.body) as ChatMessage;
				setMessages((prev) => {
					// messageId 중복이면 교체, 아니면 뒤에 추가
					if (body.messageId != null) {
						const exists = prev.some((m) => m.messageId === body.messageId);
						if (exists) {
							const replaced = prev.map((m) =>
								m.messageId === body.messageId ? body : m
							);
							replaced.sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							);
							return replaced;
						}
					}

					const next = [...prev, body];
					next.sort(
						(a, b) =>
							new Date(a.createdAt).getTime() -
							new Date(b.createdAt).getTime()
					);
					return next;
				});
			} catch {
				// parse 실패해도 그냥 무시
			}
		});

		subRef.current = sub;

		return () => {
			try {
				subRef.current?.unsubscribe();
				subRef.current = null;
			} catch {
				// ignore
			}
		};
	}, [roomId, connected]);

	// 전송 로직 (낙관적 UI 없음)
	const sendText = useCallback(
		async (content: string, roomIdOverride?: number) => {
			const text = content.trim();
			const targetRoomId = roomIdOverride ?? roomId;

			if (!text) return;
			if (!targetRoomId) return;
			if (sending) return;

			setSending(true);

			try {
				const client = clientRef.current;
				if (!client || !client.connected) {
					console.warn("[CHAT] STOMP not connected");
				}
				const destination = `/app/chat/rooms/${targetRoomId}`;

				client?.publish({
					destination,
					body: JSON.stringify({ content: text })
				});
			} catch (e) {
				console.error("[CHAT] send error:", e);
			} finally {
				setSending(false);
			}
		},
		[roomId, sending]
	);

	// 버튼/엔터에서 사용하는 send
	const send = useCallback(async () => {
		const text = input.trim();
		if (!text) return;
		if (!roomId) return;


		setInput("");
		await sendText(text, roomId);
	}, [input, roomId, sendText]);

	return {
		connected,
		sending,
		meId,
		messages,
		input,
		setInput,
		send,
		sendText,
		refetchMessages: fetchHistory
	};
}
