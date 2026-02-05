import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatRooms } from "../hooks/useChatRooms";
import type { ChatRoomSummary, ChatMessage } from "../types/message";

export default function MessagePage() {
	const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);

	// 1) 서버에서 최초 쪽지함 목록 가져오기
	const { rooms, loading, error } = useChatRooms();

	// 2) 실제 화면에 쓸 리스트는 로컬 상태로 관리
	const [roomSummaries, setRoomSummaries] = useState<ChatRoomSummary[]>([]);

	// rooms 값이 새로 들어오면 한 번 동기화
	useEffect(() => {
		setRoomSummaries(rooms);
	}, [rooms]);

	const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

	// 첫 진입 시 첫 번째 방 자동 선택
	useEffect(() => {
		if (selectedRoomId == null && roomSummaries.length > 0) {
			setSelectedRoomId(roomSummaries[0].roomId);
		}
	}, [roomSummaries, selectedRoomId]);

	const selectedRoom: ChatRoomSummary | undefined = useMemo(
		() => roomSummaries.find((r) => r.roomId === selectedRoomId),
		[roomSummaries, selectedRoomId]
	);

	// 3) 현재 선택한 방의 메시지들
	const {
		connected,
		sending,
		debug,
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

	// 4) 메시지가 변할 때마다, 해당 방의 최근 메세지를 roomSummaries에 반영
	useEffect(() => {
		if (!selectedRoomId) return;
		if (!messages.length) return;

		const last: ChatMessage = messages[messages.length - 1];

		setRoomSummaries((prev) =>
			prev.map((room) =>
				room.roomId === selectedRoomId
					? {
							...room,
							lastMessageContent: last.content,
							lastMessageCreatedAt: last.createdAt
					  }
					: room
			)
		);
	}, [messages, selectedRoomId]); // ✅ messages 전체를 의존성에 넣기

	// -------- 이하 UI 부분은 기존 코드 그대로 --------

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

	if (loading) {
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
								onSelectRoom={setSelectedRoomId}
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
