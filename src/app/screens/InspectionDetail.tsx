import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, ChevronRight, Circle, FileText, Wrench, Flag, Store, Coffee } from 'lucide-react';
import { INSPECTION_SUMMARIES } from '../lib/inspectionData';
import { getInspection } from '../lib/inspectionStore';

type SectionStatus = 'completed' | 'in-progress' | 'pending';

type Section = {
  id: string;
  title: string;
  subtitle: string;
  answered: number;
  total: number;
  flagged: number;
  status: SectionStatus;
  route: 'form' | 'questions';
  icon: typeof FileText;
};

const sections: Section[] = [
  {
    id: '1',
    title: 'Data Dealer',
    subtitle: 'Informasi dasar dealer dan manajemen',
    answered: 1,
    total: 1,
    flagged: 0,
    status: 'completed',
    route: 'form',
    icon: FileText,
  },
  {
    id: '2',
    title: 'Area Showroom',
    subtitle: 'Kebersihan lantai, display unit, dan pencahayaan',
    answered: 6,
    total: 6,
    flagged: 1,
    status: 'completed',
    route: 'questions',
    icon: Store,
  },
  {
    id: '3',
    title: 'Ruang Tunggu',
    subtitle: 'Kenyamanan AC, sofa, dan fasilitas tamu',
    answered: 3,
    total: 6,
    flagged: 0,
    status: 'in-progress',
    route: 'questions',
    icon: Coffee,
  },
  {
    id: '4',
    title: 'Service Bay',
    subtitle: 'Penerapan 5R, kebersihan, dan APD teknisi',
    answered: 0,
    total: 5,
    flagged: 0,
    status: 'pending',
    route: 'questions',
    icon: Wrench,
  },
];

function statusIcon(status: SectionStatus) {
  if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-success-green" strokeWidth={2.1} />;
  if (status === 'in-progress') return <Circle className="w-4 h-4 text-primary-blue fill-primary-blue/20" strokeWidth={2} />;
  return <Circle className="w-4 h-4 text-muted-foreground" strokeWidth={1.7} />;
}

export default function InspectionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const storedInspection = id ? getInspection(id) : undefined;
  const summaryInspection = id
    ? INSPECTION_SUMMARIES.find((item) => item.id === id)
    : undefined;
  const headerTitle =
    storedInspection?.templateName ?? summaryInspection?.title ?? 'Inspeksi';
  const headerSubtitle = storedInspection
    ? `${storedInspection.site} · ${storedInspection.templateName}`
    : summaryInspection
      ? `${summaryInspection.site} · ${summaryInspection.templateName}`
      : 'Detail inspeksi';

  const totalAnswered = sections.reduce((sum, section) => sum + section.answered, 0);
  const totalQuestions = sections.reduce((sum, section) => sum + section.total, 0);
  const totalFlags = sections.reduce((sum, section) => sum + section.flagged, 0);
  const pct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <div className="bg-background min-h-full">
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-divider/50 px-4 status-bar-aware pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl flex items-center justify-center hover:bg-surface"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-semibold text-foreground truncate">{headerTitle}</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">{headerSubtitle}</p>
          </div>
          <button className="h-8 px-3 rounded-lg border border-divider/60 text-[12px] text-muted-foreground">
            Simpan
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-foreground">
              {totalAnswered}/{totalQuestions} selesai
            </p>
            <p className="text-[13px] font-semibold text-foreground">{pct}%</p>
          </div>
          <div className="mt-1.5 h-[4px] bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary-blue rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px]">
            <span className="text-muted-foreground">{totalQuestions - totalAnswered} belum dijawab</span>
            {totalFlags > 0 && <span className="text-danger-red">{totalFlags} temuan</span>}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="rounded-2xl border border-divider/60 bg-card divide-y divide-divider/50 overflow-hidden">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const progress = section.total ? Math.round((section.answered / section.total) * 100) : 0;

            return (
              <button
                key={section.id}
                onClick={() =>
                  navigate(
                    section.route === 'form' ? `/app/inspections/${id}/form` : `/app/inspections/${id}/questions`
                  )
                }
                className="w-full text-left px-4 py-3 hover:bg-surface"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <SectionIcon className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-[14px] font-semibold text-foreground">{section.title}</p>
                      <div className="flex items-center gap-1.5">
                        {section.flagged > 0 && (
                          <span className="text-[11px] font-medium text-danger-red inline-flex items-center gap-0.5">
                            <Flag className="w-3 h-3" strokeWidth={2} />
                            {section.flagged}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {section.answered}/{section.total}
                        </span>
                        {statusIcon(section.status)}
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" strokeWidth={2} />
                      </div>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{section.subtitle}</p>
                    <div className="mt-2 h-[3px] bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary-blue rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 'calc(88px + env(safe-area-inset-bottom))' }} />

      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-divider/50 px-4 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-11 px-4 rounded-xl border border-divider/60 text-[13px]">
            Simpan Draft
          </button>
          <button
            onClick={() => navigate(`/app/inspections/${id}/review`)}
            className="flex-1 h-11 rounded-xl bg-primary-blue text-white text-[14px] font-semibold"
          >
            Review & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
