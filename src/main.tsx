import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/layout/App';
import './css/global.css';
import { StoreContext, rootStore } from './app/Stores/rootStore';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <StoreContext.Provider value={rootStore}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </>
);