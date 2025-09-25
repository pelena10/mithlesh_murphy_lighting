// ==============================|| MENU ITEMS - UI-COMPONENTS ||============================== //

const O2DOffline = {
  id: 'O2D-Offline',
  title: 'O2D OFFLINE Management',
  type: 'group',
  children: [
    {
      id: 'o2d',
      title: 'O2D OFFLINE',
      icon: <i className="ph ph-truck" />,
      type: 'collapse',
      children: [
        {
          id: 'o2d-dashboard',
          title: 'O2D Dashboard',
          type: 'item',
          icon: <i className="ph ph-gauge" />,
          url: '/o2d_order/dashboard'
        },
        {
          id: 'order',
          title: 'Create Order',
          type: 'item',
          icon: <i className="ph ph-plus-circle" />,
          url: '/o2d_order/order'
        },
        {
          id: 'create-dn',
          title: 'Create DN',
          type: 'item',
          icon: <i className="ph ph-truck" />,
          url: '/o2d_order/create-dn'
        },
        {
          id: 'create-invoice',
          title: 'Create Invoice',
          type: 'item',
          icon: <i className="ph ph-file" />,
          url: '/o2d_order/create-invoice'
        },
        {
          id: 'pending-order',
          title: 'Pending Order',
          type: 'item',
          icon: <i className="ph ph-clock" />,
          url: '/o2d_order/pending-orders'
        },
        {
          id: 'pending-dn',
          title: 'Pending DN Details',
          type: 'item',
          icon: <i className="ph ph-clock-counter-clockwise" />,
          url: '/o2d_order/pending-dns'
        },
        {
          id: 'cash-discount',
          title: '% Cash Discount',
          type: 'item',
          icon: <i className="ph ph-percent" />,
          url: '/o2d_order/cash-discount'
        },
        {
          id: 'upload-builty',
          title: 'Upload Builty',
          type: 'item',
          icon: <i className="ph ph-upload" />,
          url: '/o2d_order/upload-builty'
        },
        {
          id: 'branch-receiving',
          title: 'Branch Receiving',
          type: 'item',
          icon: <i className="ph ph-check-circle" />,
          url: '/o2d_order/branch-receiving'
        },
        {
          id: 'dn-checking',
          title: 'DN Checking',
          type: 'item',
          icon: <i className="ph ph-file-search" />,
          url: '/o2d_order/dn-checking'
        }
      ]
    }
  ]
};



export default O2DOffline;
