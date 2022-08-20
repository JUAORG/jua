import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'My Calendar',
    path: '/dashboard/service_requests',
    icon: getIcon('eva:calendar-fill'),
  },
  {
    title: 'JUA Homepage',
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
    title: 'My Profile & Rate Card',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-done-fill'),
  },
];

export default navConfig
