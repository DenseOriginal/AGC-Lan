/// <reference path="vite-env.d.ts" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { HomePage } from './pages/home';

const LoginPage = LazyRoute(() => import("./pages/login"));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={LoginPage} />
      </Routes>
    </Router>
  </React.StrictMode>
)

function LazyRoute(factory: () => Promise<{
  default: React.ComponentType<any>;
}>) {
  const Element = React.lazy(factory);
  return <React.Suspense fallback={<p>Loading...</p>}>
    <Element />
  </React.Suspense>
}