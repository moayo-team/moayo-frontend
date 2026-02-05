import { useState, useCallback, useRef } from 'react';
import type { AttachedFile } from '../types/career';

interface UploadOptions {
  maxFiles?: number;
  maxFileSizeMB?: number;
  allowedTypes?: string[];
  maxLinks?: number;      // 링크 최대 개수
  maxLinkLength?: number; // 링크당 최대 글자 수
  maxLeftText?: number;
  maxRightText?: number;
}

export const useUploadManager = (options: UploadOptions = {}) => {
  const {
    maxFiles = 4,
    maxFileSizeMB = 10,
    allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"],
    maxLinks = 4,           // 기본값 4개
    maxLinkLength = 40,      // 기본값 40자
    maxLeftText = 10,
    maxRightText = 20,
  } = options;

  const [selectedFiles, setSelectedFiles] = useState<AttachedFile[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 로직
  const handleFileUpload = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const newFiles = Array.from(incomingFiles);

    if (selectedFiles.length + newFiles.length > maxFiles) {
      return;
    }

    const isValid = newFiles.every((file) => {
      const maxSize = maxFileSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name}의 용량이 너무 큽니다. (최대 ${maxFileSizeMB}MB)`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      return true;
    });

    // 기존 파일 유효성 검사 로직
    if (isValid) {
      const mappedFiles: AttachedFile[] = newFiles.map(file => ({
        name: file.name,
        fileObj: file,
        type: 'file' // 또는 file.type
      }));

      setSelectedFiles((prev) => [...prev, ...mappedFiles]);
    }
  }, [selectedFiles, maxFiles, maxFileSizeMB, allowedTypes]);

  //파일 삭제 로직
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 링크 추가 로직
  const addLink = useCallback((linkInput: string) => {
    const trimmedLink = linkInput.trim();
    if (!trimmedLink) return;

    // 개수 제한 체크
    if (links.length >= maxLinks) {
      return false;
    }

    // 글자 수 제한 체크
    if (trimmedLink.length > maxLinkLength) {
      return false;
    }

    const formattedLink = trimmedLink.startsWith("http") ? trimmedLink : `https://${trimmedLink}`;
    setLinks((prev) => [...prev, formattedLink]);
    setLinkInput("");
  }, [linkInput, links, maxLinks, maxLinkLength]);

  // 링크 삭제
  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  // 일반 텍스트 제한 체크
  const isTextValid = (text: string, type: 'left' | 'right') => {
    const limit = type === 'left' ? maxLeftText : maxRightText;
    return text.length <= limit;
  };

  // 파일 다운로드 로직 추가 
  const handleFileDownload = useCallback((file: AttachedFile ) => {
    // File 객체인 경우 (새로 업로드한 파일)
    if (file.fileObj) {
      const url = URL.createObjectURL(file.fileObj);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // 메모리 해제
    }
    // 일반 객체인 경우 (이미 서버에 있는 파일 정보)
    else if (file.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";
      link.click();
    } else {
      alert("파일 다운로드 경로를 찾을 수 없습니다.");
    }
  }, []);

  const isInputValidByType = (text: string, type: 'link' | 'text', side?: 'left' | 'right') => {
    if (type === 'link') {
      return text.length <= maxLinkLength;
    }

    if (type === 'text') {
      const limit = side === 'left' ? maxLeftText : maxRightText;
      return text.length <= limit;
    }

    return true;
  };

  return {
    selectedFiles, setSelectedFiles, handleFileUpload, removeFile,
    links, setLinks, linkInput, setLinkInput, addLink, removeLink,
    isTextValid, fileInputRef, handleFileDownload, isInputValidByType
  };
};