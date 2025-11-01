import SideMenu from "@/next/components/SideMenu";
import { ErrorModalProvider } from "@/next/contexts/ErrorModalContext";
import { ConfigProvider } from "@/next/contexts/ConfigContext";

type DashBoardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashBoardLayoutProps) {
  return (
    <ErrorModalProvider>
      <ConfigProvider>
        <div className="flex">
          <SideMenu />
          {children}
        </div>
      </ConfigProvider>
    </ErrorModalProvider>
  );
}
