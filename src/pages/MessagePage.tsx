import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatThreadListPolling } from "../hooks/useChatThreadListPolling";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary, ChatMessage } from "../types/message";

export default function MessagePage() {
	const location = useLocation();
	const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);
	const initialRoomId = (location.state as { roomId?: number } | null)?.roomId;
	const initialRoomAppliedRef = useRef(false);

	// 1) 채팅방 목록 polling (1.5초 간격 예시)
	const {
		threads: polledRooms,
		loading,
		error
	} = useChatThreadListPolling({ intervalMs: 1500 });

	// 2) 실제 UI에서 쓸 채팅방 목록 상태
	const [roomSummaries, setRoomSummaries] = useState<ChatRoomSummary[]>([]);
	const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

	useEffect(() => {
		if (initialRoomAppliedRef.current) return;
		if (!Number.isFinite(initialRoomId)) return;

		setSelectedRoomId(Number(initialRoomId));
		initialRoomAppliedRef.current = true;
	}, [initialRoomId]);

	// 2-1) polling 결과를 roomSummaries에 diff 반영
	//      - 선택된 방은 polling으로 덮어쓰지 않고 항상 hasUnread=false 유지
	useEffect(() => {
		if (!polledRooms.length) return;

		setRoomSummaries((prev) => {
			// 최초 진입: 이전 상태가 비어 있으면 polling 결과 전체로 세팅
			if (!prev.length) {
				return polledRooms;
			}

			const prevMap = new Map<number, ChatRoomSummary>(
				prev.map((r) => [r.roomId, r])
			);

			const next: ChatRoomSummary[] = [];

			for (const item of polledRooms) {
				const prevItem = prevMap.get(item.roomId);

				// 새로 생긴 방이면 그대로 추가
				if (!prevItem) {
					next.push(item);
					continue;
				}

				// 선택된 방은 polling 결과에 상관없이 항상 hasUnread=false 유지
				if (item.roomId === selectedRoomId) {
					next.push({
						...prevItem,
						hasUnread: false
					});
					continue;
				}

				// 메시지 관련 필드가 바뀌었는지 체크
				const messageChanged =
					prevItem.lastMessageCreatedAt !== item.lastMessageCreatedAt ||
					prevItem.lastMessageContent !== item.lastMessageContent ||
					prevItem.hasUnread !== item.hasUnread;

				if (!messageChanged) {
					// 변화 없으면 기존 객체 유지 (불필요한 리렌더 방지)
					next.push(prevItem);
				} else {
					// 메시지 관련 필드만 최신 값으로 업데이트
					next.push({
						...prevItem,
						lastMessageContent: item.lastMessageContent,
						lastMessageCreatedAt: item.lastMessageCreatedAt,
						hasUnread: item.hasUnread
					});
				}
			}

			return next;
		});
	}, [polledRooms, selectedRoomId]);

	// 3) 첫 진입 시 첫 번째 방 자동 선택
	useEffect(() => {
		if (selectedRoomId == null && roomSummaries.length > 0) {
			setSelectedRoomId(roomSummaries[0].roomId);
		}
	}, [roomSummaries, selectedRoomId]);

	const selectedRoom: ChatRoomSummary | undefined = useMemo(
		() => roomSummaries.find((r) => r.roomId === selectedRoomId),
		[roomSummaries, selectedRoomId]
	);

	// 4) 현재 선택한 방의 메시지들 (STOMP + 과거 메시지)
	const {
		connected,
		sending,
		meId,
		messages,
		input,
		setInput,
		send
	} = useChatRoom({
		roomId: selectedRoomId,
		currentUserId: currentUserId || undefined
	});

	const myId = meId ?? currentUserId ?? 0;

	// 5) 방을 선택했을 때:
	//    - 선택된 방 변경
	//    - UI에서 그 방의 빨간 점( hasUnread ) 즉시 제거 (optimistic)
	//    - 서버에 읽음 처리 PATCH 날리기 (fire-and-forget)
	const handleSelectRoom = (roomId: number) => {
		setSelectedRoomId(roomId);

		// UI에서 먼저 빨간 점 제거
		setRoomSummaries((prev) =>
			prev.map((room) =>
				room.roomId === roomId
					? { ...room, hasUnread: false }
					: room
			)
		);

		// 서버 읽음 처리 (await 안 걸고 비동기 전송)
		apiClient
			.patch(`/api/v1/chat/rooms/${roomId}/read`)
			.catch((e) => {
				console.error("[CHAT] read current room error", e);
			});
	};

	// 6) 선택된 방에서 messages가 변할 때,
	//    - 해당 방의 "최근 메세지" 텍스트/시간 업데이트
	//    - 그 방은 항상 hasUnread=false 유지 (보고 있는 동안엔 빨간 점 X)
	//    - 동시에 서버에도 읽음 처리 PATCH (새 메세지까지 읽은 걸로)
	useEffect(() => {
		if (!selectedRoomId) return;
		if (!messages.length) return;

		const last: ChatMessage = messages[messages.length - 1];
		const lastRoomId = Number((last as any).chatRoomId ?? (last as any).roomId ?? (last as any).chatRoomID);
		if (Number.isFinite(lastRoomId) && lastRoomId !== selectedRoomId) {
			return;
		}

		// 로컬 목록 업데이트
		setRoomSummaries((prev) =>
			prev.map((room) =>
				room.roomId === selectedRoomId
					? {
							...room,
							lastMessageContent: last.content,
							lastMessageCreatedAt: last.createdAt,
							hasUnread: false
						}
					: room
			)
		);

		// 서버에도 이 시점 기준 읽음 처리
		apiClient
			.patch(`/api/v1/chat/rooms/${selectedRoomId}/read`)
			.catch((e) => {
				console.error("[CHAT] read on message change error", e);
			});
	}, [messages, selectedRoomId]);

	// -------- 이하 UI 부분 --------

	const BASE_WIDTH = 403 + 24 + 904;
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const update = () => {
			const w = window.innerWidth;
			setScale(Math.min(1, (w - 40) / BASE_WIDTH));
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	if (loading && roomSummaries.length === 0) {
		return (
			<div className="bg-white p-6">
				<div className="text-sm text-gray-500">쪽지함 목록 불러오는 중…</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white p-6">
				<div className="text-sm text-red-600">
					쪽지함 목록 로드 실패: {String(error)}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white">
			<main className="w-full flex justify-center">
				<div
					className="origin-top-left"
					style={{ transform: `scale(${scale})` }}
				>
					<h1 className="text-[28px] font-bold leading-[36px] tracking-normal mb-[24px]">
						쪽지함 목록
					</h1>
					<div className="flex flex-row gap-6">
						<aside className="w-[403px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden p-[31px_24px]">
							<ThreadList
								threads={roomSummaries}
								selectedRoomId={selectedRoomId}
								onSelectRoom={handleSelectRoom}
							/>
						</aside>

						<section className="w-[904px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden">
							<ChatPanel
								thread={selectedRoom as any}
								messages={messages}
								draft={input}
								onDraftChange={setInput}
								onSend={send}
								currentUserId={myId}
								connected={connected && !sending}
							/>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}