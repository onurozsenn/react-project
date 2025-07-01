import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. Redux için gerekli importları yapıyoruz
import { store } from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* 2. <Provider> ile tüm <App /> bileşenini sarmalıyoruz.
        Artık App'in içindeki tüm bileşenler Redux deposuna erişebilir. */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);