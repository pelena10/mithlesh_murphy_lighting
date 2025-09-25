// project-imports
import chartsMaps from './charts-maps';
import formComponents from './forms';
import navigation from './navigation';
import other from './other';
import pages from './pages';
import tableComponents from './tables';
import uiComponents from './ui-components';
import masterManagement from './master-management';
import userManagegment from './user-management';
import O2DOffline from './O2D-Offline'
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [userManagegment,  masterManagement, O2DOffline, navigation, uiComponents, formComponents, tableComponents, chartsMaps, pages, other]
};

export default menuItems;
