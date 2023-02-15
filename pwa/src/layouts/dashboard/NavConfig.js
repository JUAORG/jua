import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const navConfig = [
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
    title: 'Wallet',
    path: '/dashboard/wallet',
    icon: getIcon('eva:credit-card-fill'),
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

export default navConfig
