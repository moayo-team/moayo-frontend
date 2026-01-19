import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/appLayout";

import MessagePage from "./pages/MessagePage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/messages" element={<MessagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
