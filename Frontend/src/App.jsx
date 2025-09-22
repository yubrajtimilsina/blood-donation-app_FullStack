import { useState } from 'react'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <Admin />,
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    
    </>
  )
}
export default App
