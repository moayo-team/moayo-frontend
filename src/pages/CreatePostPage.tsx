import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/Navbar';
import { useCreatePost } from '../hooks/usePosts';
import { SuccessModal } from '../components/common/SuccessModal';
import type { JSX } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CATEGORIES } from '../constants/categories';

interface JobCategory {
  id: string;
  label: string;
  selected: boolean;
}

export const CreatePostPage = (): JSX.Element => {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recruitCount, setRecruitCount] = useState('');
  const [positions, setPositions] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requirements, setRequirements] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [categories, setCategories] = useState<JobCategory[]>(
    CATEGORIES.map((c) => ({ ...c, selected: false }))
  );

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // 굵게, 기울임, 밑줄, 취소선
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // 리스트
      [{ 'color': [] }, { 'background': [] }],          // 글자색, 배경색
      [{ 'align': [] }],                                // 정렬
      ['clean']                                         // 포맷 지우기
    ],
  };

  const handleCategoryToggle = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, selected: !cat.selected } : cat
      )
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !deadline) {
      alert('제목, 내용, 마감일은 필수 입력 항목입니다.');
      return;
    }

    const selectedTags = categories
      .filter((cat) => cat.selected)
      .map((cat) => cat.label)
      .join(',');

    if (!selectedTags) {
      alert('최소 하나의 직무 태그를 선택해주세요.');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        description: content.trim().substring(0, 100), // First 100 chars as description
        content: content.trim(),
        deadline: new Date(deadline),
        category: selectedTags.split(',')[0], // First tag as main category
        tags: selectedTags,
        recruitCount: parseInt(recruitCount) || 1,
        positions: positions.trim() || '미정',
        requirements: requirements.trim() || '없음',
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to create post:', error);
      // AxiosError 인 경우 서버가 반환한 메시지 사용
      const anyErr = error as any;
      const serverMessage = anyErr?.response?.data?.message || anyErr?.message || '게시글 등록에 실패했습니다.';
      alert(serverMessage);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white pb-20">
      <NavigationBar />

      <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-center">

          {/* Main Content */}
          <main className="flex-1">
            <header className="flex items-center justify-between gap-4 mb-8">
              <h1 className="relative w-fit font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-2xl sm:text-[26px] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] [font-style:var(--heading-h1-200-font-style)]">
                게시판 글 작성하기
              </h1>
            </header>

            <form className="flex flex-col gap-6">
              {/* Title Input */}
              <div className="flex w-full items-center gap-[30px]">
                <label
                  htmlFor="post-title"
                  className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[16px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
                >
                  제목
                </label>

                <div className="flex flex-col h-[60px] items-start justify-center gap-2.5 p-5 relative flex-1 grow rounded-[10px] border border-solid border-[#d6d6d8]">
                  <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="입력해주세요."
                    className="w-full font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-black text-[16px] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] [font-style:var(--body-b1-100-font-style)] placeholder:text-gray-scalegray-scale-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Post Filters Section */}
              <section className="flex flex-col w-full items-start gap-2.5 p-5 bg-gray-scale30 rounded-[20px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
                    <label
                      htmlFor="recruit-count"
                      className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[14px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
                    >
                      모집인원
                    </label>

                    <input
                      id="recruit-count"
                      type="number"
                      min="1"
                      value={recruitCount}
                      onChange={(e) => setRecruitCount(e.target.value)}
                      placeholder="인원 입력"
                      className="flex flex-col w-[120px] h-12 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-900 text-[15px] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] placeholder:text-gray-scalegray-scale-500 focus:outline-none focus:border-primaryprimary-500"
                    />
                  </div>

                  <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                    <label
                      htmlFor="positions"
                      className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[14px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
                    >
                      모집 포지션
                    </label>

                    <input
                      id="positions"
                      type="text"
                      value={positions}
                      onChange={(e) => setPositions(e.target.value)}
                      placeholder="예: 디자이너, 개발자"
                      className="flex flex-col w-[180px] h-12 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-900 text-[15px] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] placeholder:text-gray-scalegray-scale-500 focus:outline-none focus:border-primaryprimary-500"
                    />
                  </div>

                  <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                    <label
                      htmlFor="deadline"
                      className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[14px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
                    >
                      마감일
                    </label>

                    <input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="flex flex-col w-[160px] h-12 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-900 text-[15px] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] focus:outline-none focus:border-primaryprimary-500"
                    />
                  </div>
                </div>
              </section>

              {/* Content Section */}
              <section className="flex flex-col w-full min-h-[417px] items-start gap-2.5 px-4 sm:px-8 py-8 rounded-[10px] border border-solid border-[#d6d6d8]">
                <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <label htmlFor="post-content" className="sr-only">
                    게시물 본문 입력
                  </label>
                  <div className="w-full h-[500px]"> 
                    <ReactQuill 
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      // 👇 핵심 수정 사항
                      // 1. [&_.ql-toolbar]: 상단 툴바 스타일 (테두리 색상 변경, 둥근 모서리 위쪽만)
                      // 2. [&_.ql-container]: 하단 입력창 스타일 (남은 높이 꽉 채우기, 둥근 모서리 아래쪽만)
                      // 3. border-[#d6d6d8]: 사용자님이 원하던 회색 테두리 색상 적용
                      className="h-full flex flex-col [&_.ql-toolbar]:border-[#d6d6d8] [&_.ql-toolbar]:rounded-t-[10px] [&_.ql-toolbar]:border-b-0 [&_.ql-toolbar]:p-3 [&_.ql-toolbar_button]:w-9 [&_.ql-toolbar_button]:h-9 [&_.ql-toolbar_button]:p-1.5 [&_.ql-toolbar_button_svg]:!w-6 [&_.ql-toolbar_button_svg]:!h-6 [&_.ql-picker-label]:text-base [&_.ql-picker-item]:text-base [&_.ql-container]:border-[#d6d6d8] [&_.ql-container]:rounded-b-[10px] [&_.ql-container]:flex-1 [&_.ql-container]:overflow-y-auto [&_.ql-editor]:text-[16px] [&_.ql-editor]:leading-relaxed [&_.ql-editor]:font-body-regular"
                      placeholder="내용을 입력하세요..."
                    />
                  </div>
                </div>
              </section>

              {/* Requirements Section */}
              <section className="flex flex-col w-full items-start justify-center gap-2.5 px-6 py-5 bg-gray-scale30 rounded-[10px]">
                <div className="flex flex-col gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <h2 className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[16px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]">
                    요구사항 (선택)
                  </h2>

                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="필요한 역량이나 조건을 입력해주세요."
                    className="w-full min-h-[100px] p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[15px] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] placeholder:text-gray-scalegray-scale-500 resize-none focus:outline-none focus:border-primaryprimary-500"
                  />
                </div>
              </section>

              {/* Job Tags Selection Section */}
              <section className="flex flex-col w-full items-start justify-center gap-2.5 px-6 py-5 bg-gray-scale30 rounded-[10px]">
                <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                  <h2 className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[16px] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]">
                    직무태그 설정
                  </h2>
                  
                  <div className="inline-flex flex-wrap items-center gap-2.5 relative flex-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex min-w-[80px] h-10 items-center justify-center gap-1.5 px-4 relative ${
                          category.selected
                            ? 'bg-primaryprimary-50 border-primaryprimary-500'
                            : 'bg-gray-scalegray-scale-50 border-gray-scalegray-scale-300'
                        } rounded-[10px] border border-solid hover:opacity-80 transition-opacity`}
                        aria-pressed={category.selected}
                      >
                        <span className={`flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] ${
                          category.selected
                            ? 'text-gray-scalegray-scale-900'
                            : 'text-gray-scalegray-scale-300'
                        } text-[14px] text-center leading-[var(--body-b1-200-line-height)] relative tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex w-[120px] h-14 items-center justify-center gap-2.5 px-[15px] py-2.5 bg-gray-scalegray-scale-100 rounded-[10px] hover:bg-gray-scalegray-scale-200 transition-colors"
                >
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-700 text-[15px] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    취소
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createPostMutation.isPending}
                  className="flex w-[200px] h-14 items-center justify-center gap-2.5 px-[15px] py-2.5 bg-primaryprimary-500 rounded-[10px] hover:bg-primaryprimary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[15px] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    {createPostMutation.isPending ? '등록 중...' : '게시글 등록하기'}
                  </span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/board');
        }}
        title="게시글이 등록되었습니다!"
        message="작성하신 게시글이 성공적으로 등록되었습니다."
      />
    </div>
  );
};
