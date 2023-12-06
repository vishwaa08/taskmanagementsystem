import { INavbarData } from './helper';

export const beforeLoginData: INavbarData[] = [
  {
    routeLink: '/',
    icon: 'home',
    label: 'Home',
  },
  {
    routeLink: 'register',
    icon: 'person_add',
    label: 'Sign Up',
    open: true,
  },
  {
    routeLink: 'login',
    icon: 'login',
    label: 'Login',
  },
];

export const afterLoginData: INavbarData[] = [
  {
    routeLink: '/',
    icon: 'home',
    label: 'Home',
  },
  {
    routeLink: '/dashboard',
    icon: 'person_add',
    label: 'Dashboard'
  },
  {
    routeLink: '/add-task',
    icon: 'add_task',
    label: 'Add New Task',
  },

];