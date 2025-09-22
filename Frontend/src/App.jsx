import { useState } from 'react'
import {RouterProvider, createBrowserRouter, Outlet, Navigate} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Prospects from './pages/Prospects';
import Donors from './pages/Donors';

function App() {

  const Layout =() =>{
    return(
      <div className='flex'>
        <div>
          <h1>Menu</h1>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    )
  }
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
      element: <Layout />,
      children:[
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/admin/prospects",
          element: <Prospects />,
        },
        {
          path: "/admin/donors",
          element: <Donors />,
        }
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    
    </>
  )
}
export default App
