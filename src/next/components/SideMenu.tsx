"use client";
import {
  ConfigContextProps,
  useConfigContext,
} from "@/next/contexts/ConfigContext";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

type MenuItem = {
  href: string;
  label: string;
  icon: string;
  enabler?: (
    configContext: ConfigContextProps,
    currentPathname: string,
  ) => true | string;
};

const menuItems: MenuItem[] = [
  {
    href: "/dashboard/configuration/simulation",
    label: "Simulation config.",
    icon: "⚙️",
  },
  {
    href: "/dashboard/configuration/project",
    label: "Project config.",
    icon: "🔧",
    enabler: (configContext: ConfigContextProps) =>
      configContext.selectedProject ? true : "Select a project first",
  },
  {
    href: "/dashboard/controls",
    label: "Controls",
    icon: "🎮",
    enabler: (configContext: ConfigContextProps) =>
      configContext.selectedProject ? true : "Select a project first",
  },
];

type MenuItemProps = {
  item: MenuItem;
  currentPathname: string;
};

function MenuItem({ item, currentPathname }: MenuItemProps) {
  const configContext = useConfigContext();
  const [isActive, setIsActive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [tooltipText, setTooltipText] = useState<string | null>(null);

  const verifyActive = () => {
    setIsActive(item.href === currentPathname);
  };

  useEffect(verifyActive, [item.href, currentPathname]);
  useEffect(() => {
    if (item.enabler) {
      const enabled = item.enabler(configContext, currentPathname);
      setIsEnabled(enabled === true);
      if (typeof enabled === "string") setTooltipText(enabled);
      else setTooltipText(null);
    } else {
      setIsEnabled(true);
      setTooltipText(null);
    }
  });

  return (
    <Tooltip title={tooltipText}>
      <Link
        href={isEnabled ? item.href : ""}
        style={{
          cursor: isEnabled ? "pointer" : "not-allowed",
          opacity: isEnabled ? 1 : 0.5,
        }}
        className={clsx(
          "px-4 py-2 block select-none ",
          isActive && "bg-blue-600 text-white",
          isEnabled && "hover:bg-blue-200",
        )}
      >
        <span>{item.icon}</span>
        <span className="aside-item-label ml-4">{item.label}</span>
      </Link>
    </Tooltip>
  );
}

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <>
      <div className="aside-spacer min-w-13 simulation-aside-"></div>
      <aside className="overflow-y-auto text-nowrap overflow-x-clip bg-gray-100 py-4 fixed h-dvh flex items-center simulation-aside z-10">
        <ul className="flex flex-col gap-2 w-full">
          {menuItems.map((item) => (
            <li key={item.href}>
              <MenuItem item={item} currentPathname={pathname} />
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
