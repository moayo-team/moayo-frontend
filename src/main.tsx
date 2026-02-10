import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // 만약 App이 export default가 아니라면 { App }으로 수정
import './index.css'

// 1. 질문자님이 추가한 Quill 에디터 스타일을 상대방 파일에 가져옵니다.
import 'react-quill-new/dist/quill.snow.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// 2. 상대방의 ID인 'root'를 사용합니다.
const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

