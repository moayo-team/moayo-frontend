import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary } from "../types/message";

type ApiEnvelope<T> = {
	isSuccess: boolean;
	code: string;
	message: string;
	timestamp?: string;
	result: T;
};

type UseChatThreadListPollingOptions = {
	intervalMs?: number;
};

export function useChatThreadListPolling(
	options: UseChatThreadListPollingOptions = {}
) {
	const { intervalMs = 1500 } = options; // 기본 1.5초

	const [threads, setThreads] = useState<ChatRoomSummary[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchThreads = async () => {
		try {
			setError(null);
			setLoading(true);

			const res = await apiClient.get<
				ApiEnvelope<ChatRoomSummary[]>
			>("/api/v1/chat/rooms"); // 실제 백엔드 경로 맞춰줘

			const next = res.data.result ?? [];
			setThreads(next);
		} catch (e) {
			console.error("[THREAD_POLL] fetch error", e);
			setError("채팅방 목록을 불러오지 못했어요");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchThreads();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!intervalMs || intervalMs <= 0) return;

		const id = window.setInterval(() => {
			fetchThreads();
		}, intervalMs);

		return () => {
			window.clearInterval(id);
		};
	}, [intervalMs]);

	return {
		threads,
		loading,
		error,
		refetchThreads: fetchThreads,
		setThreads
	};
}
