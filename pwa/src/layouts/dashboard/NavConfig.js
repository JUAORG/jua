import Iconify from '../../components/Iconify';
import { showCustomerView } from '../../actions/UI';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const advisorNavConfig = [
  // {
  //   title: 'My Calendar',
  //   path: '/dashboard/service_requests',
  //   icon: getIcon('eva:calendar-fill'),
  // },
  {
    title: 'Homepage',
    path: '/dashboard/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'JUA Network',
    path: '/dashboard/jua_network',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Service Requests',
    path: '/dashboard/service_requests',
    icon: getIcon('eva:inbox-fill'),
  },
  {
    title: 'My Profile',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-done-fill'),
  },
  {
    title: 'FAQ',
    path: '/dashboard/faq',
    icon: getIcon('eva:info-outline'),
  },
  {
    title: 'Feedback',
    path: '/dashboard/about',
    icon: getIcon('eva:heart-fill'),
  },
];

const customerNavConfig = [
  {
    title: 'Bookings',
    path: '/dashboard/service_requests',
    icon: getIcon('eva:calendar-fill'),
  },
  {
    title: 'Services',
    path: '/dashboard/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'My Profile',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-done-fill'),
  },
  {
    title: 'FAQ',
    path: '/dashboard/faq',
    icon: getIcon('eva:info-outline'),
  },
  {
    title: 'Feedback',
    path: '/dashboard/about',
    icon: getIcon('eva:heart-fill'),
  },
];

const navConfig = showCustomerView() ? customerNavConfig : advisorNavConfig
export default navConfig
