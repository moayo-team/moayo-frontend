import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "../index.css";
import 'react-quill-new/dist/quill.snow.css';


createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
