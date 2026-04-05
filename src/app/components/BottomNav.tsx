import { NavLink, useLocation } from 'react-router';
import { Home, ClipboardList, CheckSquare, GraduationCap, Menu, BookOpenCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { canUseActions } from '../lib/appConfig';

// All routes that should highlight the More tab
const MORE_SUB_PATHS = [
  '/app/more',
  '/app/issues',
  '/app/lone-worker',
  '/app/sensors',
  '/app/assets',
  '/app/analytics',
  '/app/heads-up',
  '/app/documents',
  '/app/marketplace',
  '/app/library',
  '/app/settings',
];

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home', end: true },
  { to: '/app/inspections', icon: ClipboardList, label: 'Inspections', end: false },
  { to: '/app/cps', icon: BookOpenCheck, label: 'CPS', end: false },
  { to: '/app/actions', icon: CheckSquare, label: 'Actions', end: false },
  { to: '/app/training', icon: GraduationCap, label: 'Training', end: false },
  { to: '/app/more', icon: Menu, label: 'More', end: false },
];

export function BottomNav() {
  const location = useLocation();
  const visibleItems = canUseActions ? navItems : navItems.filter((item) => item.to !== '/app/actions');

  const isActive = (to: string, end: boolean) => {
    if (to === '/app/home') {
      return location.pathname === '/app/home' || location.pathname === '/app';
    }
    if (to === '/app/more') {
      return MORE_SUB_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
    }
    return end ? location.pathname === to : location.pathname.startsWith(to);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/96 backdrop-blur-sm border-t border-divider/40"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {visibleItems.map(item => {
          const active = isActive(item.to, item.end);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px]"
            >
              {/* Icon — 24px, colour-only active state */}
              <motion.div
                animate={active ? { y: -1 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <Icon
                  className={active ? 'text-primary-blue' : 'text-muted-foreground'}
                  style={{ width: 24, height: 24 }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`text-[10px] leading-none transition-colors duration-150 ${active ? 'text-primary-blue font-medium' : 'text-muted-foreground'
                  }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
