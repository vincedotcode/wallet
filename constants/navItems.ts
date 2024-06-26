// constants/navItems.ts
import { Icons } from '@/components/icons';
import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  // Root user navigation
  {
    title: 'Dashboard',
    href: '/root/dashboard',
    icon: 'dashboard',
    role: 'root',
  },
  {
    title: 'Roles',
    href: '/cobrand/roles',
    icon: 'lock',
    role: 'root',
  },
  {
    title: 'Tenants',
    href: '/root/tenants',
    icon: 'attachMoney',
    role: 'root',
  },
  // Wallet user navigation
  {
    title: 'Dashboard',
    href: '/wallet/dashboard',
    icon: 'dashboard',
    role: 'WalletUser',
  },
  {
    title: 'Deposit',
    href: '/deposit',
    icon: 'accountBalanceWallet',
    role: 'WalletUser',
    condition: 'isKycCompleted',
  },
  {
    title: 'Scan To Pay',
    href: '/wallet/scan',
    icon: 'qrCodeScanner',
    role: 'WalletUser',
    condition: 'isKycCompleted',
  },
  {
    title: 'Transaction List',
    href: '/wallet/transactions',
    icon: 'attachMoney',
    role: 'WalletUser',
    condition: 'isKycCompleted',
  },
  {
    title: 'Settings',
    href: '/wallet/settings',
    icon: 'settings',
    role: 'WalletUser',
  },
  // BackOffice user navigation
  {
    title: 'Dashboard',
    href: '/cobrand/dashboard',
    icon: 'dashboard',
    role: 'BackOffice',
  },
  {
    title: 'Ewallet Management',
    href: '/cobrand/ewallet-management',
    icon: 'billing',
    role: 'BackOffice',
  },
  {
    title: 'QR Transaction',
    href: '/cobrand/qr-transactions',
    icon: 'qrCodeScanner',
    role: 'BackOffice',
  },
  {
    title: 'MY QR Codes',
    href: '/cobrand/qrcodes',
    icon: 'qrCode',
    role: 'BackOffice',
  },
  {
    title: 'Users',
    href: '/cobrand/users',
    icon: 'persons',
    role: 'BackOffice',
  },
  {
    title: 'Wallet Users',
    href: '/cobrand/clients/users',
    icon: 'persons',
    role: 'BackOffice',
  },
  {
    title: 'Roles',
    href: '/cobrand/roles',
    icon: 'lock',
    role: 'BackOffice',
  },
];
