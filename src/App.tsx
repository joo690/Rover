import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Navigation from "./pages/Navigation";
import Energy from "./pages/Energy";
import Vision from "./pages/Vision";
import Storage from "./pages/Storage";
import Safety from "./pages/Safety";
import Impact from "./pages/Impact";
import CloudData from "./pages/CloudData";
import Analytics from "./pages/Analytics";
import AIPerformance from "./pages/AIPerformance";
import ROI from "./pages/ROI";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import InitializeDB from "./pages/InitializeDB";
import FirebaseAdmin from "./pages/FirebaseAdmin";
import FirebaseDebug from "./pages/FirebaseDebug";
import Configuration from "./pages/Configuration";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/energy" element={<Energy />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/cloud" element={<CloudData />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-performance" element={<AIPerformance />} />
              <Route path="/roi" element={<ROI />} />
              <Route path="/team" element={<Team />} />
              <Route path="/initialize-db" element={<InitializeDB />} />
              <Route path="/firebase-admin" element={<FirebaseAdmin />} />
              <Route path="/firebase-debug" element={<FirebaseDebug />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
