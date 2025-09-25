import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import O2DDashboard from '../views/o2d_order/O2DDashboard';
import Order from '../views/o2d_order/Order';
import CreateDN from '../views/o2d_order/CreateDN';
import CreateInvoice from '../views/o2d_order/CreateInvoice';
import PendingOrders from '../views/o2d_order/PendingOrderDetails';
import PendingDNs from '../views/o2d_order/PendingDNs';
import CashDiscount from '../views/o2d_order/CashDiscount';
import UploadBuilty from '../views/o2d_order/UploadBuilty';
import BranchReceiving from '../views/o2d_order/BranchReceiving';
import DNChecking from '../views/o2d_order/DNChecking';

// render - chart pages
const ApexChart = Loadable(lazy(() => import('views/charts/ApexChart')));

// render - map pages
const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

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
          path: 'o2d_order',
          children: [
            { path: 'dashboard', element: <O2DDashboard /> },
            { path: 'order', element: <Order /> },
            { path: 'create-dn', element: <CreateDN /> },
            { path: 'create-invoice', element: <CreateInvoice /> },
            { path: 'pending-orders', element: <PendingOrders /> },
            { path: 'pending-dns', element: <PendingDNs /> },
            { path: 'cash-discount', element: <CashDiscount /> },
            { path: 'upload-builty', element: <UploadBuilty /> },
            { path: 'branch-receiving', element: <BranchReceiving /> },
            { path: 'dn-checking', element: <DNChecking /> }
          ]
        }
      ]
    }
  ]
};

export default ChartMapRoutes;
