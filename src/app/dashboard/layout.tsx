import SideMenu from "@/next/components/SideMenu";
import { ErrorModalProvider } from "@/next/contexts/ErrorModalContext";
import { ConfigProvider } from "@/next/contexts/ConfigContext";
import { SimulationProvider } from "@/next/contexts/SimulationContext";
import { GraphVisualizationProvider } from "@/next/contexts/GraphVisualizationContext";

type DashBoardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashBoardLayoutProps) {
  return (
    <ErrorModalProvider>
      <ConfigProvider>
        <SimulationProvider>
          <GraphVisualizationProvider>
            <div className="flex">
              <SideMenu />
              {children}
            </div>
          </GraphVisualizationProvider>
        </SimulationProvider>
      </ConfigProvider>
    </ErrorModalProvider>
  );
}
