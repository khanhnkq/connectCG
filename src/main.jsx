window.global = window;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import './index.css';

// Khởi tạo Mock Service khi chạy ở chế độ Standalone Mock Mode
if (import.meta.env.VITE_USE_MOCK === "true") {
  const { initMockService } = await import("./mocks");
  initMockService();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* [NEW] */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
