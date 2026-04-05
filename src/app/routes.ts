import { createBrowserRouter } from "react-router";
import Landing from "./screens/Landing";
import Entry from "./screens/Entry";
import Onboarding from "./screens/Onboarding";
import LoginGate from "./screens/LoginGate";
import MainLayout from "./components/MainLayout";
import Home from "./screens/Home";
import InspectionsList from "./screens/InspectionsList";
import CpsList from "./screens/CpsList";
import CreateTemplate from "./screens/CreateTemplate";
import TemplateBuilder from "./screens/TemplateBuilder";
import TemplateEditor from "./screens/TemplateEditor";
import TemplateAccess from "./screens/TemplateAccess";
import InspectionDetail from "./screens/InspectionDetail";
import FormPage from "./screens/FormPage";
import QuestionPage from "./screens/QuestionPage";
import MediaCapture from "./screens/MediaCapture";
import CreateIssue from "./screens/CreateIssue";
import ReviewSummary from "./screens/ReviewSummary";
import ReportPreview from "./screens/ReportPreview";
import Actions from "./screens/Actions";
import Notifications from "./screens/Notifications";
import Settings from "./screens/Settings";
import ProfileDetail from "./screens/ProfileDetail";
import TeamDetail from "./screens/TeamDetail";
import Training from "./screens/Training";
import DesignSystem from "./screens/DesignSystem";
import InspectionTitlePage from "./screens/InspectionTitlePage";
import NotFound from "./screens/NotFound";
import More from "./screens/More";
import Issues from "./screens/Issues";
import LoneWorker from "./screens/LoneWorker";
import Sensors from "./screens/Sensors";
import Assets from "./screens/Assets";
import Analytics from "./screens/Analytics";
import HeadsUp from "./screens/HeadsUp";
import Documents from "./screens/Documents";
import Marketplace from "./screens/Marketplace";
import Library from "./screens/Library";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Entry,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/landing",
    Component: Landing,
  },
  {
    path: "/login",
    Component: LoginGate,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "home", Component: Home },
      { path: "inspections", Component: InspectionsList },
      { path: "cps", Component: CpsList },
      { path: "inspections/template", Component: CreateTemplate },
      { path: "templates/new", Component: TemplateBuilder },
      { path: "templates/:id/edit", Component: TemplateEditor },
      { path: "templates/:id/access", Component: TemplateAccess },
      { path: "inspections/:id/title", Component: InspectionTitlePage },
      { path: "inspections/:id", Component: InspectionDetail },
      { path: "inspections/:id/form", Component: FormPage },
      { path: "inspections/:id/questions", Component: QuestionPage },
      { path: "inspections/:id/media", Component: MediaCapture },
      { path: "inspections/:id/issue", Component: CreateIssue },
      { path: "inspections/:id/review", Component: ReviewSummary },
      { path: "inspections/:id/report", Component: ReportPreview },
      { path: "actions", Component: Actions },
      { path: "training", Component: Training },
      { path: "notifications", Component: Notifications },
      { path: "more", Component: More },
      { path: "issues", Component: Issues },
      { path: "lone-worker", Component: LoneWorker },
      { path: "sensors", Component: Sensors },
      { path: "assets", Component: Assets },
      { path: "analytics", Component: Analytics },
      { path: "heads-up", Component: HeadsUp },
      { path: "documents", Component: Documents },
      { path: "marketplace", Component: Marketplace },
      { path: "library", Component: Library },
      { path: "settings", Component: Settings },
      { path: "settings/profile", Component: ProfileDetail },
      { path: "settings/team", Component: TeamDetail },
      { path: "design-system", Component: DesignSystem },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
