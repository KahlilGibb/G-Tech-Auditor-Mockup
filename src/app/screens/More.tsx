import { useNavigate } from 'react-router';
import { ChevronRight, AlertCircle, UserCheck, Radio, Car, BarChart2, Bell, FileText, ShoppingBag, BookOpen, Settings } from 'lucide-react';

type MoreItem = {
  icon: typeof AlertCircle;
  iconBg: string;
  iconColor: string;
  label: string;
  desc: string;
  to: string;
};

const FEATURE_ITEMS: MoreItem[] = [
  {
    icon: AlertCircle,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    label: 'Issues',
    desc: 'Kelola temuan & eskalasi masalah',
    to: '/app/issues',
  },
  // {
  //   icon: UserCheck,
  //   iconBg: 'bg-amber-500/10',
  //   iconColor: 'text-amber-600',
  //   label: 'Lone Worker',
  //   desc: 'Pantau keselamatan teknisi mandiri',
  //   to: '/app/lone-worker',
  // },
  {
    icon: Radio,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600',
    label: 'Sensors',
    desc: 'Monitor sensor lingkungan bengkel',
    to: '/app/sensors',
  },
  {
    icon: Car,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    label: 'Assets',
    desc: 'Daftar & status aset dealer',
    to: '/app/assets',
  },
  {
    icon: BarChart2,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    label: 'Analytics',
    desc: 'Laporan & tren hasil inspeksi',
    to: '/app/analytics',
  },
  {
    icon: Bell,
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    label: 'Heads Up',
    desc: 'Pengumuman & pesan siaran tim',
    to: '/app/heads-up',
  },
  {
    icon: FileText,
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
    label: 'Documents',
    desc: 'Dokumen SOP, manual & sertifikat',
    to: '/app/documents',
  },
  // {
  //   icon: ShoppingBag,
  //   iconBg: 'bg-indigo-500/10',
  //   iconColor: 'text-indigo-600',
  //   label: 'Marketplace',
  //   desc: 'Integrasi dan add-on tambahan',
  //   to: '/app/marketplace',
  // },
  {
    icon: BookOpen,
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-600',
    label: 'Library',
    desc: 'Template & standar inspeksi dealer',
    to: '/app/library',
  },
];

const ACCOUNT_ITEMS: MoreItem[] = [
  {
    icon: Settings,
    iconBg: 'bg-neutral-500/10',
    iconColor: 'text-neutral-500',
    label: 'Settings',
    desc: 'Profil, tim, tema, & preferensi',
    to: '/app/settings',
  },
];

function MoreRow({ item, onClick }: { item: MoreItem; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-surface active:bg-secondary flex items-center gap-3 transition-colors"
    >
      <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-[18px] h-[18px] ${item.iconColor}`} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground">{item.label}</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={2} />
    </button>
  );
}

function Section({ title, items, navigate }: { title: string; items: MoreItem[]; navigate: (to: string) => void }) {
  return (
    <section>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold mb-2 px-1">{title}</p>
      <div className="rounded-2xl border border-divider bg-card divide-y divide-divider/50 overflow-hidden">
        {items.map(item => (
          <MoreRow key={item.to} item={item} onClick={() => navigate(item.to)} />
        ))}
      </div>
    </section>
  );
}

export default function More() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-full">
      <div className="sticky top-0 z-20 status-bar-aware px-4 pb-3 border-b border-divider bg-card">
        <h1 className="text-[17px] font-semibold tracking-tight text-foreground">More</h1>
      </div>

      <div className="px-4 py-4 space-y-4 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <Section title="Fitur" items={FEATURE_ITEMS} navigate={navigate} />
        <Section title="Akun" items={ACCOUNT_ITEMS} navigate={navigate} />
      </div>
    </div>
  );
}
