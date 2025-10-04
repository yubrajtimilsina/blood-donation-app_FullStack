import { useState } from 'react'
import {RouterProvider, createBrowserRouter, Outlet, Navigate} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Prospects from './pages/Prospects';
import Donors from './pages/Donors';
import Menu from './components/Menu';
import Prospect from './pages/Prospect';
import Donor from './pages/Donor';
import NewDonor from './pages/NewDonor';
import { useSelector } from 'react-redux';
import BloodRequests from './pages/BloodRequest';
import DonorPortal from './pages/DonorPortal';

function App() {
   const user = useSelector((state) => state.user);
  const Layout =() =>{
    return(
      <div className='flex'>
        <div>
          <Menu />
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
      element: user.currentUser ? <Layout /> : <Navigate to="/login" />,
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
        },
        {
          path: "/admin/prospect/:id",
          element: <Prospect />,
        },
        {
          path: "/admin/newdonor",
          element: <NewDonor />,
        },
        {
          path: "/admin/donor/:id",
          element: <Donor />,
        },
        { path: "/admin/donor-portal/:id",
           element: <DonorPortal /> 
          },
        {
          path: "/admin/bloodRequests",
          element: <BloodRequests />,
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
