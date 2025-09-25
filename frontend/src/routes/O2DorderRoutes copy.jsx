import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import Order from '../views/o2d_order/Order'
// render - chart pages
const ApexChart = Loadable(lazy(() => import('views/charts/ApexChart')));

// render - map pages
const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const ChartMapRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'charts',
          children: [
            {
              path: 'apex-chart',
              element: <ApexChart />
            }
          ]
        },
        {
          path: '/o2d_order/dashboard',
          children: [
            {
              path: '/o2d_order/dashboard',
              element: <Order />
            }
          ]
        },
        {
          path: '/o2d_order/order',
          children: [
            {
              path: '/o2d_order/order',
              element: <Order />
            }
          ]
        }
      ]
    }
  ]
};

export default ChartMapRoutes;
