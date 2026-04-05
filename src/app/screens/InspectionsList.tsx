import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  LayoutList,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { ScrollChipsRow } from '../components/ScrollChipsRow';
import { TemplateActionsSheet } from '../components/template/TemplateActionsSheet';
import { StartInspectionSheet } from '../components/template/StartInspectionSheet';
import { InspectionDetailsSheet, type InspectionDetailMeta } from '../components/InspectionDetailsSheet';
import { createInspection } from '../lib/inspectionStore';
import {
  INSPECTION_SUMMARIES,
  type InspectionStatus,
  type InspectionSummary,
} from '../lib/inspectionData';
import { getInspectionEntryRoute } from '../lib/inspectionRoutes';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'templates' | 'progress';
type TemplateItem = {
  id: string;
  name: string;
  description: string;
  author: string;
  questionCount: number;
  lastModified: string;  // display label
  modifiedDate: string;  // ISO date string for grouping
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const TEMPLATE_SEED: TemplateItem[] = [
  {
    id: 'tpl-001',
    name: 'Pre-Delivery Inspection (PDI)',
    description: 'Pemeriksaan standar sebelum kendaraan diserahkan ke pelanggan.',
    author: 'Alex R.',
    questionCount: 21,
    lastModified: '27 Feb 2026',
    modifiedDate: '2026-02-27',
  },
  {
    id: 'tpl-002',
    name: 'Monthly Safety Check – Bengkel',
    description: 'Checklist keselamatan bulanan untuk showroom dan bengkel.',
    author: 'Diana K.',
    questionCount: 18,
    lastModified: '4 Feb 2026',
    modifiedDate: '2026-02-04',
  },
  {
    id: 'tpl-003',
    name: 'Audit 5R Showroom (FY25)',
    description: 'Audit internal terkait 5R area display, service bay, dan gudang.',
    author: 'Ari Budi',
    questionCount: 20,
    lastModified: '4 Feb 2026',
    modifiedDate: '2026-02-04',
  },
];

const inspectionItems = INSPECTION_SUMMARIES;

const progressFilters: Array<InspectionStatus | 'All'> = ['All', 'In Progress', 'Complete', 'Draft', 'Overdue'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusTone(status: InspectionStatus) {
  if (status === 'Overdue') return 'bg-danger-red/10 text-danger-red';
  if (status === 'Complete') return 'bg-success-green/10 text-success-green';
  if (status === 'Draft') return 'bg-secondary text-muted-foreground';
  return 'bg-primary-blue/10 text-primary-blue';
}

function statusLabel(status: InspectionStatus): string {
  if (status === 'Overdue') return 'Terlambat';
  if (status === 'Complete') return 'Selesai';
  if (status === 'Draft') return 'Draft';
  return 'Berjalan';
}

function progressBarColor(status: InspectionStatus): string {
  if (status === 'Overdue') return 'bg-danger-red';
  if (status === 'Complete') return 'bg-success-green';
  return 'bg-primary-blue';
}

// ─── Create Template Sheet (2-step) ───────────────────────────────────────────

type CreateStep = 'options' | 'ai';

function OptionRow({
  icon,
  label,
  description,
  recommended,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  recommended?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-3.5 text-left active:bg-black/[0.04] dark:active:bg-white/[0.06] transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0 text-primary-blue">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-foreground">{label}</span>
          {recommended && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary-blue/10 text-primary-blue">
              Rekomendasi
            </span>
          )}
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/35 flex-shrink-0" strokeWidth={1.8} />
    </button>
  );
}

function CreateTemplateSheet({
  isOpen,
  onClose,
  onDescribeTopic,
  onUploadMedia,
  onStartWithTemplate,
  onStartFromScratch,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDescribeTopic: (topic?: string) => void;
  onUploadMedia: () => void;
  onStartWithTemplate: () => void;
  onStartFromScratch: () => void;
}) {
  const [step, setStep] = useState<CreateStep>('options');
  const [aiTopic, setAiTopic] = useState('');
  const exampleTopics = ['PDI Avanza 2024', '5R Showroom (FY25)', 'Safety Monthly Check'];

  // Reset to step 1 after sheet closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('options');
        setAiTopic('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/55 z-[60]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto max-h-[85svh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 flex-shrink-0">
              <div className="w-10 h-1 bg-divider rounded-full" />
            </div>

            {/* Header row */}
            <div className="flex items-center gap-2 px-5 pt-3 pb-3 border-b border-divider/50 flex-shrink-0">
              {step === 'ai' && (
                <button
                  onClick={() => setStep('options')}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary flex-shrink-0"
                  aria-label="Kembali"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              )}
              <h3 className="flex-1 text-[16px] font-semibold text-foreground">
                {step === 'options' ? 'Buat template' : 'Buat dengan AI'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary flex-shrink-0"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-[max(env(safe-area-inset-bottom),20px)]">

              {/* ── Step 1: Options ── */}
              {step === 'options' && (
                <div className="divide-y divide-divider/40">
                  {/* <OptionRow
                    icon={<Sparkles className="w-5 h-5" strokeWidth={1.8} />}
                    label="Buat dengan AI"
                    description="Generate template dari deskripsi atau topik."
                    recommended
                    onClick={() => setStep('ai')}
                  /> */}
                  <OptionRow
                    icon={<Upload className="w-5 h-5" strokeWidth={1.8} />}
                    label="Upload dokumen"
                    description="Buat template dari SOP atau dokumen yang ada."
                    onClick={onUploadMedia}
                  />
                  <OptionRow
                    icon={<ClipboardList className="w-5 h-5" strokeWidth={1.8} />}
                    label="Pakai template library"
                    description="Pilih dari template siap pakai lalu sesuaikan."
                    onClick={onStartWithTemplate}
                  />
                  <OptionRow
                    icon={<Plus className="w-5 h-5" strokeWidth={2} />}
                    label="Mulai dari kosong"
                    description="Buat template baru dari awal."
                    onClick={onStartFromScratch}
                  />
                </div>
              )}

              {/* ── Step 2: AI input ── */}
              {step === 'ai' && (
                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-[12px] text-muted-foreground mb-2">
                      Jelaskan topik atau jenis inspeksi yang ingin dibuat:
                    </p>
                    <textarea
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Contoh: PDI kendaraan bekas untuk showroom, audit 5R area service bay..."
                      rows={4}
                      className="w-full px-3.5 py-3 rounded-xl border border-divider/50 bg-foreground/[0.05] text-[13px] placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/45 resize-none"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Contoh topik
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exampleTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setAiTopic(topic)}
                          className={`h-7 px-2.5 rounded-full text-[11px] font-medium border transition-colors ${aiTopic === topic
                              ? 'bg-primary-blue text-white border-primary-blue'
                              : 'border-primary-blue/30 text-primary-blue bg-primary-blue/5'
                            }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onDescribeTopic(aiTopic.trim() || undefined);
                      onClose();
                    }}
                    disabled={!aiTopic.trim()}
                    className="w-full h-12 rounded-xl bg-primary-blue text-white text-[14px] font-semibold disabled:opacity-40"
                    style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function InspectionsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [templateQuery, setTemplateQuery] = useState('');
  const [progressQuery, setProgressQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<InspectionStatus | 'All'>('All');

  // Template mutable state (supports duplicate + archive)
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>(TEMPLATE_SEED);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  // Sheet state
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [startingTemplate, setStartingTemplate] = useState<TemplateItem | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<InspectionSummary | null>(null);

  const todayISO = new Date().toISOString().split('T')[0]; // '2026-02-27'

  const filteredTemplates = useMemo(() => {
    const keyword = templateQuery.toLowerCase();
    return templateItems
      .filter((item) => !archivedIds.includes(item.id))
      .filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.author.toLowerCase().includes(keyword)
      );
  }, [templateQuery, templateItems, archivedIds]);

  // Group filtered templates by date (sorted by most-recent first)
  const groupedTemplates = useMemo(() => {
    const groups: Array<{ label: string; date: string; items: TemplateItem[] }> = [];
    const seen = new Map<string, number>();

    filteredTemplates.forEach((t) => {
      const key = t.modifiedDate;
      if (!seen.has(key)) {
        const label = key === todayISO ? 'Hari ini' : t.lastModified;
        seen.set(key, groups.length);
        groups.push({ label, date: key, items: [] });
      }
      groups[seen.get(key)!].items.push(t);
    });

    return groups;
  }, [filteredTemplates, todayISO]);

  const filteredInspections = useMemo(() => {
    const keyword = progressQuery.toLowerCase();
    return inspectionItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(keyword) ||
        item.site.toLowerCase().includes(keyword) ||
        item.templateName.toLowerCase().includes(keyword);
      const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [progressQuery, activeFilter]);

  const inProgressCount = inspectionItems.filter((item) => item.status === 'In Progress').length;

  // Handler: duplicate a template
  function handleDuplicateTemplate(id: string) {
    const source = templateItems.find((t) => t.id === id);
    if (!source) return;
    const newItem: TemplateItem = {
      ...source,
      id: `${id}-copy-${Date.now()}`,
      name: `${source.name} (Salinan)`,
      lastModified: 'Baru saja',
      modifiedDate: new Date().toISOString().split('T')[0],
    };
    setTemplateItems((prev) => [newItem, ...prev]);
  }

  // Handler: "Mulai Inspeksi" tapped inside TemplateActionsSheet
  function handleStartFromActions(templateId: string) {
    const template = templateItems.find((t) => t.id === templateId) ?? null;
    setSelectedTemplate(null);   // close actions sheet
    setStartingTemplate(template); // open start sheet
  }

  // Handler: "Mulai" tapped inside StartInspectionSheet
  function handleFinalStart(templateId: string, site: string) {
    const template = templateItems.find((t) => t.id === templateId);
    const insp = createInspection(templateId, template?.name ?? 'Inspeksi', site);
    setStartingTemplate(null);
    navigate(`/app/inspections/${insp.id}/title`);
  }

  // Handler: "Lanjutkan Inspeksi" / "Lihat Laporan" tapped inside InspectionDetailsSheet
  function handleContinueInspection(id: string) {
    const item = inspectionItems.find((inspection) => inspection.id === id);
    if (!item) {
      navigate(`/app/inspections/${id}`);
      return;
    }
    navigate(getInspectionEntryRoute(item));
  }

  // Handler: "Duplikat" tapped inside InspectionDetailsSheet
  function handleDuplicateInspection(_id: string) {
    // no-op for demo
  }

  return (
    <div className="bg-background min-h-full">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[17px] font-semibold tracking-tight">Inspections</h1>
          <button className="h-8 px-3 rounded-lg border border-divider/60 text-[12px] text-muted-foreground">
            Filter
          </button>
        </div>

        {/* Segmented tabs */}
        <div className="mt-3 flex rounded-xl p-[3px] h-10 gap-[3px] bg-foreground/[0.07]">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 rounded-[9px] text-[13px] font-medium transition-colors ${activeTab === 'templates' ? 'bg-primary-blue text-white shadow-sm' : 'text-muted-foreground'
              }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 rounded-[9px] text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-1 ${activeTab === 'progress' ? 'bg-primary-blue text-white shadow-sm' : 'text-muted-foreground'
              }`}
          >
            Berjalan & Selesai
            {inProgressCount > 0 && (
              <span
                className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full text-[10px] px-1 ${activeTab === 'progress' ? 'bg-white/25 text-white' : 'bg-primary-blue/15 text-primary-blue'
                  }`}
              >
                {inProgressCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Templates Tab ─────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="px-4 pt-3 pb-[calc(92px+env(safe-area-inset-bottom))]">

          {/* Search */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              strokeWidth={1.8}
            />
            <input
              type="text"
              value={templateQuery}
              onChange={(event) => setTemplateQuery(event.target.value)}
              placeholder="Cari template..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-divider/50 bg-foreground/[0.05] text-[13px] placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/45"
            />
          </div>

          {/* Section header with inline create action */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Template Anda
            </p>
            <button
              onClick={() => setShowCreateSheet(true)}
              className="h-7 px-2.5 rounded-lg bg-primary-blue/10 text-primary-blue text-[11px] font-medium inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
              Buat Template
            </button>
          </div>

          {/* Grouped template list */}
          {groupedTemplates.length > 0 ? (
            <div className="space-y-4">
              {groupedTemplates.map((group) => (
                <div key={group.date}>
                  {/* Date label */}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    {group.label}
                  </p>

                  {/* Template rows */}
                  <div className="rounded-xl border border-divider/50 bg-card divide-y divide-divider/40 overflow-hidden">
                    {group.items.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className="w-full text-left px-4 py-3.5 flex items-center gap-3 active:bg-black/[0.04] dark:active:bg-white/[0.06] transition-colors"
                      >
                        {/* Leading tonal icon */}
                        <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                          <LayoutList className="w-[18px] h-[18px] text-primary-blue" strokeWidth={1.8} />
                        </div>

                        {/* Text content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-foreground leading-snug">
                            {template.name}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
                            {template.description || 'Tanpa deskripsi'}
                          </p>
                          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                            {template.author} · {template.lastModified} · {template.questionCount} pertanyaan
                          </p>
                        </div>

                        {/* Trailing chevron */}
                        <ChevronRight
                          className="w-4 h-4 text-muted-foreground/30 flex-shrink-0"
                          strokeWidth={1.8}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <LayoutList className="w-6 h-6 text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">Tidak ada template</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {templateQuery ? 'Coba kata kunci lain.' : 'Buat template pertama Anda.'}
                </p>
              </div>
              {!templateQuery && (
                <button
                  onClick={() => setShowCreateSheet(true)}
                  className="h-9 px-4 rounded-xl bg-primary-blue text-white text-[13px] font-semibold mt-1"
                >
                  Buat Template
                </button>
              )}
            </div>
          )}

          {/* FAB — Templates tab only */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCreateSheet(true)}
            className="fixed right-4 z-40 w-14 h-14 rounded-full bg-primary-blue text-white flex items-center justify-center"
            style={{
              bottom: 'calc(76px + env(safe-area-inset-bottom))',
              boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
            }}
            aria-label="Buat template"
          >
            <Plus className="w-7 h-7" strokeWidth={2.2} />
          </motion.button>
        </div>
      )}

      {/* ── Berjalan & Selesai Tab ────────────────────────────── */}
      {activeTab === 'progress' && (
        <div className="pb-8">

          {/* Search — scrolls with content */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                strokeWidth={1.8}
              />
              <input
                type="text"
                value={progressQuery}
                onChange={(event) => setProgressQuery(event.target.value)}
                placeholder="Cari inspeksi..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-divider/50 bg-foreground/[0.05] text-[13px] placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/45"
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="pb-2">
            <ScrollChipsRow
              items={progressFilters}
              activeItem={activeFilter}
              onSelect={(item) => setActiveFilter(item as InspectionStatus | 'All')}
              ariaLabel="Filter status inspeksi"
              showEdgeFade
            />
          </div>

          {/* Inspection list — with progress bars */}
          <div className="px-4 pt-1">
            {filteredInspections.length > 0 ? (
              <div className="rounded-xl border border-divider/50 bg-card divide-y divide-divider/40 overflow-hidden">
                {filteredInspections.map((item) => {
                  const pct = Math.round((item.progress.completed / item.progress.total) * 100);
                  const entryRoute = getInspectionEntryRoute(item);
                  const shouldGoTitle = entryRoute.endsWith('/title');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (shouldGoTitle) {
                          navigate(entryRoute);
                          return;
                        }
                        setSelectedInspection(item);
                      }}
                      className="w-full text-left px-4 py-3.5 active:bg-black/[0.04] dark:active:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-start gap-2 mb-1.5">
                        <p className="flex-1 text-[14px] font-semibold text-foreground">{item.title}</p>
                        <span
                          className={`flex-shrink-0 text-[10px] font-semibold px-2 py-[3px] rounded-full mt-0.5 ${statusTone(item.status)}`}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground line-clamp-1">
                        {item.site} · {item.templateName}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressBarColor(item.status)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {item.progress.completed}/{item.progress.total}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {item.assignee} · Tenggat {item.dueDate}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-[13px] text-muted-foreground">
                Tidak ada inspeksi ditemukan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sheets ────────────────────────────────────────────── */}

      {/* Create Template (2-step) */}
      <CreateTemplateSheet
        isOpen={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onDescribeTopic={(topic) => {
          setShowCreateSheet(false);
          const path = topic
            ? `/app/templates/new?topic=${encodeURIComponent(topic)}`
            : '/app/templates/new';
          navigate(path);
        }}
        onUploadMedia={() => {
          setShowCreateSheet(false);
          navigate('/app/templates/new');
        }}
        onStartWithTemplate={() => {
          setShowCreateSheet(false);
          navigate('/app/inspections/template');
        }}
        onStartFromScratch={() => {
          setShowCreateSheet(false);
          navigate('/app/templates/new');
        }}
      />

      {/* Template Actions */}
      <TemplateActionsSheet
        template={selectedTemplate}
        isBookmarked={selectedTemplate ? bookmarkedIds.includes(selectedTemplate.id) : false}
        onClose={() => setSelectedTemplate(null)}
        onStartInspection={handleStartFromActions}
        onEdit={(id) => {
          navigate(`/app/templates/${id}/edit`);
        }}
        onDuplicate={handleDuplicateTemplate}
        onToggleBookmark={(id) => {
          setBookmarkedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          );
        }}
        onManageAccess={(id) => navigate(`/app/templates/${id}/access`)}
        onArchive={(id) => {
          setArchivedIds((prev) => [...prev, id]);
        }}
      />

      {/* Start Inspection setup */}
      <StartInspectionSheet
        template={startingTemplate}
        onClose={() => setStartingTemplate(null)}
        onStart={handleFinalStart}
      />

      {/* Inspection Details */}
      <InspectionDetailsSheet
        inspection={
          selectedInspection
            ? {
              id: selectedInspection.id,
              title: selectedInspection.title,
              site: selectedInspection.site,
              assignee: selectedInspection.assignee,
              dueDate: selectedInspection.dueDate,
              templateName: selectedInspection.templateName,
              status: selectedInspection.status as InspectionDetailMeta['status'],
              progress: selectedInspection.progress,
              lastSynced: selectedInspection.lastSynced,
            }
            : null
        }
        onClose={() => setSelectedInspection(null)}
        onContinue={handleContinueInspection}
        onDuplicate={handleDuplicateInspection}
      />
    </div>
  );
}
