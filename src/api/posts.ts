import { apiClient } from './client';
import type { Post, PostDraft } from '../types';
import { mapLabelToEnum } from '../constants/categories';

const parsePost = (raw: any): Post => {
  // ensure id is string
  const id = raw.id ?? raw.postId ?? raw.post_id ?? raw.postIdStr ?? String(raw.postId ?? raw.id ?? "");

  const createdAtVal = raw.createdAt ?? raw.created_at ?? raw.createdDate ?? raw.created;
  const updatedAtVal = raw.updatedAt ?? raw.updated_at ?? raw.updatedDate ?? raw.updated;
  const deadlineVal =
    raw.deadline ??
    raw.deadlineDate ??
    raw.deadline_date ??
    raw.deadlineAt ??
    raw.deadline_at ??
    raw.dueDate ??
    raw.due_date ??
    raw.closeDate ??
    raw.close_date ??
    raw.endDate ??
    raw.end_date;

  const fallbackDeadlineFromDday = () => {
    const dday = raw.dday as string | undefined;
    if (!dday) return undefined;
    const match = dday.match(/D\s*[-+]\s*(\d+)/i);
    if (!match) return undefined;
    const days = Number(match[1]);
    if (!Number.isFinite(days)) return undefined;
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    dateOnly.setDate(dateOnly.getDate() + days);
    return dateOnly;
  };

  return {
    // copy known fields first, then coerce types below
    ...raw,
    id: String(id),
    createdAt: createdAtVal ? new Date(createdAtVal) : new Date(),
    updatedAt: updatedAtVal ? new Date(updatedAtVal) : new Date(),
    deadline: deadlineVal ? new Date(deadlineVal) : (fallbackDeadlineFromDday() ?? new Date()),
  } as Post;
};

// 서버 응답의 다양한 필드명을 클라이언트 Post 타입으로 매핑
const normalizeServerItem = (item: any): any => {
  if (!item) return item;

  const mapped: any = { ...item };

  // id
  mapped.id = item.id ?? item.postId ?? item.post_id ?? (item.postId ? String(item.postId) : undefined);

  // createdByUserId
  mapped.createdByUserId =
    item.createdByUserId ??
    item.created_by_user_id ??
    item.createdBy ??
    item.created_by ??
    item.authorId ??
    item.author_id ??
    item.userId ??
    item.user_id ??
    item.userID ??
    item.writerId ??
    item.writer_id ??
    item.writer?.id ??
    item.writer?.userId ??
    item.memberId ??
    item.member_id ??
    item.member?.id ??
    item.ownerId ??
    item.owner_id ??
    item.user?.id ??
    item.user?.userId ??
    item.user?.memberId ??
    item.author?.id;

  // title/content/description
  mapped.title = item.title ?? item.name ?? item.subject ?? '';
  mapped.content = item.content ?? item.body ?? item.text ?? item.description ?? item.summary ?? '';
  mapped.description = item.description ?? item.summary ?? item.content ?? item.body ?? '';

  // category
  mapped.category = item.category ?? item.categoryLabel ?? item.category_label ?? item.type;

  // positions / role
  mapped.positions = item.positions ?? item.role ?? item.roles ?? '';

  // recruitCount / totalCount
  const rawCount =
    item.recruitCount ??
    item.recruit_count ??
    item.totalCount ??
    item.total_count ??
    item.recruitmentCount ??
    undefined;

    if (typeof rawCount === 'string') {
      const numeric = rawCount.replace(/\D/g, '');
      mapped.recruitCount = numeric ? Number(numeric) : undefined;
    } else {
    mapped.recruitCount = rawCount;
  }

  // deadline
  mapped.deadline =
    item.deadline ??
    item.deadlineDate ??
    item.deadline_date ??
    item.deadlineAt ??
    item.deadline_at ??
    item.dueDate ??
    item.due_date ??
    item.closeDate ??
    item.close_date ??
    item.endDate ??
    item.end_date;

  // author mapping
  mapped.author = item.author ?? {
    id:
      item.authorId ??
      item.author_id ??
      item.userId ??
      item.user_id ??
      item.writerId ??
      item.writer_id ??
      item.memberId ??
      item.member_id ??
      item.createdByUserId ??
      item.created_by_user_id ??
      item.createdBy ??
      item.created_by ??
      item.author?.id ??
      item.author?.userId ??
      item.author?.memberId ??
      item.user?.id,
    name: item.authorNickname ?? item.authorNickname ?? item.authorName ?? item.author?.name ?? item.nickname ?? '익명',
    username: item.authorUsername ?? item.username ?? item.author?.username,
    avatar: item.profileImageUrl ?? item.profileImage ?? item.imageUrl ?? item.author?.avatar ?? item.author?.profileImageUrl,
  };

  // viewCount
  mapped.viewCount = item.viewCount ?? item.views ?? item.totalViews ?? undefined;

  // dday (server may include dday string)
  if (item.dday) mapped.dday = item.dday;

  return mapped;
};

// CATEGORY_MAP는 중앙 상수 파일에서 관리됩니다 (src/constants/categories.ts)

const formatDateOnly = (d: any) => {
  if (!d) return undefined;
  const date = typeof d === 'string' ? new Date(d) : d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().split('T')[0];
};

export const postsApi = {
  // 게시글 목록을 가져옵니다 (필터 및 페이지네이션 옵션 지원)
  getPosts: async (filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    page?: number;
    pageSize?: number;
    createdByCurrentUser?: boolean;
    sort?: string;
    order?: string;
    limit?: number;
  }): Promise<{ posts: Post[]; total: number; totalPages: number }> => {
  // 현재 사용자가 작성한 게시글을 조회하는 경우 '/posts/me' 엔드포인트로 호출
    if (filters?.createdByCurrentUser) {
  const res = await apiClient.get('/api/v1/posts/me');
      const raw = res.data;
      const posts: Post[] = (raw?.posts || raw?.content || raw || []).map(parsePost);
      const total = raw?.total || raw?.totalElements || posts.length;
      const totalPages = raw?.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
      return { posts, total, totalPages };
    }

    const params: Record<string, any> = {};
    // 프론트는 페이지를 1부터 표시하지만, 백엔드는 0부터 시작하는 경우가 많으므로
    // API로 보낼 때는 1-based 값을 0-based로 변환합니다. (예: UI 1 -> API 0)
    if (filters?.page !== undefined && filters?.page !== null) {
      // 안전장치: 음수 방지
      const pageNum = Number(filters.page) || 0;
      params.page = Math.max(0, pageNum - 1);
    }
    if (filters?.pageSize) params.pageSize = filters.pageSize;
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = mapLabelToEnum(filters.category);

    const mappedTags = (filters?.tags || [])
      .map((label) => mapLabelToEnum(label))
      .filter((v): v is string => Boolean(v));

    if (mappedTags.length > 0) {
      // 백엔드가 다양한 파라미터명을 사용할 수 있어 호환성 확보
      params.tags = mappedTags.join(',');
      params.categories = mappedTags.join(',');

      // 단일 선택일 경우 category 파라미터도 전달
      if (!params.category && mappedTags.length === 1) {
        params.category = mappedTags[0];
      }
    }
    if (filters?.sort) params.sort = filters.sort;
    if (filters?.order) params.order = filters.order;
    if (filters?.limit) params.limit = filters.limit;

  const res = await apiClient.get('/api/v1/posts', { params });
  let raw = res.data;
  // 공통 응답 래퍼(BaseResponse) 언랩: { isSuccess, code, message, timestamp, result }
  if (raw && raw.result !== undefined) raw = raw.result;

  // 다양한 응답 형태 지원 (Spring pageable 형식 또는 커스텀 형식 등)
    let items: any[] = [];
    let total = 0;
    let totalPages = 0;

    if (Array.isArray(raw)) {
      items = raw;
      total = raw.length;
      totalPages = 1;
    } else if (raw && raw.content) {
      items = raw.content;
      total = raw.totalElements ?? raw.total ?? items.length;
      totalPages = raw.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
    } else if (raw && raw.posts) {
      items = raw.posts;
      total = raw.total ?? items.length;
      totalPages = raw.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
    } else if (raw && raw.data && Array.isArray(raw.data)) {
      items = raw.data;
      total = items.length;
      totalPages = 1;
    } else {
      items = (raw && raw.items) || [];
      total = (raw && raw.total) || items.length;
      totalPages = (raw && raw.totalPages) ?? Math.ceil(total / (filters?.pageSize || 10));
    }

    let posts: Post[] = (items || []).map(normalizeServerItem).map(parsePost);

    // 다중 필터 선택 시 합집합(OR) 필터를 클라이언트에서 보장
    if (filters?.tags && filters.tags.length > 0) {
      const selected = new Set(filters.tags.map((t) => String(t).trim()).filter(Boolean));
      posts = posts.filter((p) => {
        const tagList = String((p as any).tags ?? '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        const candidates = new Set([
          ...tagList,
          String(p.category ?? '').trim(),
          String(p.positions ?? '').trim(),
        ].filter(Boolean));
        return Array.from(selected).some((t) => candidates.has(t));
      });
      total = posts.length;
      totalPages = Math.max(1, Math.ceil(total / (filters?.pageSize || 10)));
    }

    return { posts, total, totalPages };
  },

  // 단일 게시글 조회
  getPost: async (id: string): Promise<Post> => {
  const res = await apiClient.get(`/api/v1/posts/${id}`);
  let raw = res.data;
  if (raw && raw.result !== undefined) raw = raw.result;
  return parsePost(normalizeServerItem(raw));
  },

  // 게시글 생성
  createPost: async (post: PostDraft): Promise<Post> => {
      // Build backend payload mapping client fields to backend expected fields
      // 클라이언트 필드들을 백엔드가 기대하는 필드명/형식으로 매핑하여 페이로드를 구성
      const backendPayload: Record<string, any> = {
        title: post.title,
        content: post.content,
  // 한글 카테고리 레이블을 백엔드 enum 값으로 매핑 (가능한 경우)
  category: mapLabelToEnum(post.category as string) || post.category,
        // positions 필드는 role로 전달 (문자열 그대로 전달)
    role: (post as any).positions || (post as any).role || undefined,
        // recruitCount는 백엔드의 totalCount에 매핑
        totalCount: (post as any).recruitCount ?? (post as any).totalCount,
        // 마감일은 백엔드 예시처럼 날짜만 YYYY-MM-DD 형식으로 포맷
        deadline: formatDateOnly(post.deadline),
      };

  const res = await apiClient.post('/api/v1/posts', backendPayload);
  let raw = res.data;
  // unwrap if BaseResponse
  const unwrapped = raw && raw.result !== undefined ? raw.result : raw;


  // 서버가 원시 id(예: 3 또는 숫자 문자열)를 반환한 경우 생성된 리소스를 조회
  if (unwrapped === null || unwrapped === undefined) {
    // try to recover created id from common places
    const possibleId = (raw && raw.id) || (raw && raw.result && raw.result.id) || (res.headers && (res.headers.location || res.headers.Location) && String((res.headers.location || res.headers.Location).split('/').pop()));
    if (possibleId) {
      return await postsApi.getPost(String(possibleId));
    }
    const err = new Error('Empty response from create post API');
    // attach server body for easier debugging
    (err as any).serverResponse = raw;
    throw err;
  }

  // unwrapped가 단순 숫자 또는 숫자 문자열인 경우 id로 간주
  if (typeof unwrapped === 'number' || (typeof unwrapped === 'string' && /^\d+$/.test(unwrapped))) {
    return await postsApi.getPost(String(unwrapped));
  }

  // unwrapped가 게시글 객체일 가능성이 있으면 파싱하여 반환. 단, id만 포함된 경우에는 GET으로 상세 조회
  if (typeof unwrapped === 'object') {
    if (unwrapped.id && !(unwrapped.createdAt || unwrapped.updatedAt)) {
      return await postsApi.getPost(String(unwrapped.id));
    }
    return parsePost(unwrapped);
  }

  throw new Error('Unsupported response from create post API');
  },

  // 게시글 수정
  updatePost: async (id: string, post: Partial<PostDraft>): Promise<Post> => {
    // 백엔드 기대 필드로 매핑
    const backendPayload: Record<string, any> = {
      title: post.title,
      content: post.content,
      category: mapLabelToEnum(post.category as string) || post.category,
      // positions -> role
      role: (post as any).positions || (post as any).role || undefined,
      // recruitCount -> totalCount
      totalCount: (post as any).recruitCount ?? (post as any).totalCount,
      // 날짜는 YYYY-MM-DD 형식으로 전달
      deadline: formatDateOnly(post.deadline),
    };

    // undefined 필드는 제거
    const payload = Object.fromEntries(
      Object.entries(backendPayload).filter(([, v]) => v !== undefined)
    );

    const res = await apiClient.patch(`/api/v1/posts/${id}`, payload);
    let raw = res.data;
    if (raw && raw.result !== undefined) raw = raw.result;
    return parsePost(raw);
  },

  // 게시글 삭제
  deletePost: async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/posts/${id}`);
  },
};
