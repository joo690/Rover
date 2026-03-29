import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <StatusBar />
        <main className="flex-1 p-6 overflow-auto bg-grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}
