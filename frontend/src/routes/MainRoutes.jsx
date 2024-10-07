import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import RequiredAuth from './RequiredAuth';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ArtistCreate = Loadable(lazy(() => import('pages/admin/artists')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/admin',
  element: <RequiredAuth allowedRoles={['ADMIN']} />, 
  children: [
    {
      path: '', 
      element: <Dashboard />, 
      children: [
        {
          path: 'artists/create',
          element: <ArtistCreate />
        },
        {
          path: '', 
          element: <DashboardDefault />
        },
        {
          path: 'color',  
          element: <Color />
        },
        {
          path: 'dashboard',  
          children: [
            {
              path: 'default', 
              element: <DashboardDefault />
            }
          ]
        },
        {
          path: 'sample-page', 
          element: <SamplePage />
        },
        {
          path: 'shadow', 
          element: <Shadow />
        },
        {
          path: 'typography', 
          element: <Typography />
        }
      ]
    }
  ]
};

export default MainRoutes;
