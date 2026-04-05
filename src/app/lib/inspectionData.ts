export type InspectionStatus = 'In Progress' | 'Complete' | 'Draft' | 'Overdue';

export type InspectionSummary = {
  id: string;
  templateId: string;
  title: string;
  site: string;
  assignee: string;
  dueDate: string;
  templateName: string;
  status: InspectionStatus;
  progress: { completed: number; total: number };
  lastSynced?: string;
};

export const INSPECTION_SUMMARIES: InspectionSummary[] = [
  {
    id: '1',
    templateId: 'tpl-001',
    title: 'Audit Kebersihan Dealer',
    site: 'Dealer Sunter',
    assignee: 'Riko Pratama',
    dueDate: '28 Feb 2026',
    templateName: 'Kebersihan Dealer Standard',
    status: 'In Progress',
    progress: { completed: 12, total: 21 },
    lastSynced: '27 Feb 2026 pukul 15.15',
  },
  {
    id: '2',
    templateId: 'tpl-002',
    title: 'Pengecekan Fasilitas Dealer',
    site: 'Dealer Kelapa Gading',
    assignee: 'Sari Wulandari',
    dueDate: '2 Mar 2026',
    templateName: 'Audit Fasilitas Bulanan',
    status: 'Draft',
    progress: { completed: 5, total: 15 },
    lastSynced: '25 Feb 2026 pukul 09.30',
  },
  {
    id: '3',
    templateId: 'tpl-003',
    title: 'Audit Standar Pelayanan',
    site: 'Service Center Puri',
    assignee: 'Andi Nugroho',
    dueDate: '24 Feb 2026',
    templateName: 'Standar Pelayanan Dealer',
    status: 'Overdue',
    progress: { completed: 9, total: 18 },
    lastSynced: '24 Feb 2026 pukul 11.00',
  },
  {
    id: '4',
    templateId: 'tpl-003',
    title: 'Audit 5R Showroom',
    site: 'Dealer PIK',
    assignee: 'Nadia Putri',
    dueDate: '20 Feb 2026',
    templateName: 'Audit 5R Showroom',
    status: 'Complete',
    progress: { completed: 20, total: 20 },
    lastSynced: '20 Feb 2026 pukul 17.45',
  },
];
