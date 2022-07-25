import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'JUA Homepage',
    path: '/dashboard/app',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'JUA Network',
    path: '/dashboard/jua_network',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Service Requests',
    path: '/dashboard/service_requests',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Saved Opportunities',
    path: '/dashboard/saved_opportunities',
    icon: getIcon('eva:file-text-fill'),
  },
  // {
  //   title: 'Settings',
  //   path: '/dashboard/settings',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: 'My Profile & Rate Card',
    path: '/dashboard/profile',
    icon: getIcon('eva:people-fill'),
  },
];

export default navConfig;
