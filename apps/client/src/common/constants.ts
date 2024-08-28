import { NavLinkProps } from 'components/NavLink.vue'

export const navLinks: NavLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'sym_o_space_dashboard',
    exactActiveClass: 'bg-app-9 shadow-2',
    to: { name: 'dashboard' },
  },
]
