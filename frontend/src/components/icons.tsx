import type { ReactNode, SVGProps } from "react";

/**
 * Inline SVG icon set. No icon font, no external assets — the portal must
 * render identically on an offline departmental network.
 */
export type IconName =
  | "search"
  | "menu"
  | "close"
  | "chevronDown"
  | "chevronUp"
  | "chevronRight"
  | "chevronLeft"
  | "arrowRight"
  | "arrowLeft"
  | "arrowUp"
  | "copy"
  | "check"
  | "checkCircle"
  | "download"
  | "printer"
  | "phone"
  | "mapPin"
  | "fileText"
  | "shield"
  | "globe"
  | "contrast"
  | "sun"
  | "moon"
  | "monitor"
  | "textSize"
  | "external"
  | "mail"
  | "clock"
  | "alertTriangle"
  | "info"
  | "plus"
  | "minus"
  | "user"
  | "users"
  | "building"
  | "chart"
  | "trash"
  | "eye"
  | "eyeOff"
  | "logout"
  | "lock"
  | "calendar"
  | "refresh"
  | "filter"
  | "home"
  | "siren"
  | "headset"
  | "message"
  | "megaphone"
  | "scale"
  | "leaf"
  | "droplet"
  | "lightbulb"
  | "road"
  | "send"
  | "share"
  | "list"
  | "grid"
  | "bell"
  | "flag"
  | "newspaper"
  | "award"
  | "bolt"
  | "sparkle"
  | "clockCheck";

const PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H4" />
      <path d="m10 6-6 6 6 6" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 20V4" />
      <path d="m6 10 6-6 6 6" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.7 2.7L16 9.5" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  printer: (
    <>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </>
  ),
  phone: (
    <path d="M21.5 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.6 4.2 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.6 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2.2z" />
  ),
  mapPin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" />
    </>
  ),
  contrast: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  textSize: (
    <>
      <path d="M3 7V5h8v2" />
      <path d="M7 5v14" />
      <path d="M5 19h4" />
      <path d="M13 12v-1h7v1" />
      <path d="M16.5 11v8" />
      <path d="M14.5 19h4" />
    </>
  ),
  external: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  alertTriangle: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-5" />
      <path d="M12 8h.01" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-5 3.5 3L20 7" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.9 17.9A10.7 10.7 0 0 1 12 20C5 20 1 12 1 12a20.8 20.8 0 0 1 5.1-6.1" />
      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a20.8 20.8 0 0 1-2.5 3.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M2 2l20 20" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  refresh: (
    <>
      <path d="M23 4v6h-6" />
      <path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.5V19l4 2v-8.5z" />,
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  siren: (
    <>
      <path d="M7 18h10" />
      <path d="M12 2v3" />
      <path d="M5 18v-5a7 7 0 0 1 14 0v5" />
      <path d="M3 21h18" />
      <path d="M3 12H1M23 12h-2" />
    </>
  ),
  headset: (
    <>
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
      <path d="M21 18a3 3 0 0 1-3 3h-3" />
    </>
  ),
  message: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  megaphone: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" />
      <path d="M15 8a4 4 0 0 1 0 8" />
      <path d="M18 5a8 8 0 0 1 0 14" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M5 7h14" />
      <path d="M5 7 2 14h6z" />
      <path d="M19 7l-3 7h6z" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-10 0 12-5 17-9 17z" />
      <path d="M4 21c4-4 8-7 14-9" />
    </>
  ),
  droplet: <path d="M12 2.7 6.3 8.4a8 8 0 1 0 11.4 0z" />,
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </>
  ),
  road: (
    <>
      <path d="M4 21 8 3" />
      <path d="M20 21 16 3" />
      <path d="M12 7v3M12 14v3" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
    </>
  ),
  newspaper: (
    <>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V8" />
      <path d="M18 14h-8M18 18h-8M10 6h8v4h-8z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.2 13.4 7 22l5-3 5 3-1.2-8.6" />
    </>
  ),
  bolt: <path d="M13 2 3 14h8l-1 8 11-13h-9z" />,
  sparkle: (
    <>
      <path d="M12 3l2 5.9L20 11l-6 2.1L12 19l-2-5.9L4 11l6-2.1z" />
      <path d="M19 3v3M20.5 4.5h-3" />
    </>
  ),
  clockCheck: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l2 1.5" />
      <path d="m15.5 17 1.5 1.5 3-3" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "name" | "width" | "height">;

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.8,
  ...rest
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

/** The portal crest — an abstract state badge, not the official State Emblem. */
export function TnCrest({ className = "", size = 44 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="CivicForce Tamil Nadu portal crest"
    >
      <defs>
        <linearGradient id="crestNavy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15405f" />
          <stop offset="100%" stopColor="#0f2942" />
        </linearGradient>
        <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c65c" />
          <stop offset="100%" stopColor="#b8952b" />
        </linearGradient>
      </defs>
      <path
        d="M24 2.5 42 8v16.5c0 10.2-7.1 17.6-18 21-10.9-3.4-18-10.8-18-21V8z"
        fill="url(#crestNavy)"
        stroke="url(#crestGold)"
        strokeWidth="2"
      />
      <path
        d="M24 7.5 37 11.6v12.7c0 7.6-5.2 13.2-13 16-7.8-2.8-13-8.4-13-16V11.6z"
        fill="none"
        stroke="rgba(212,175,55,0.5)"
        strokeWidth="0.9"
      />
      <path d="M14.5 27.5h19" stroke="#d4af37" strokeWidth="1.1" />
      <path d="M17 30.5h14" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
      <text
        x="24"
        y="23.6"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="14.5"
        fontWeight="700"
        fill="#f3e2a4"
        letterSpacing="1"
      >
        TN
      </text>
      <circle cx="24" cy="13.4" r="1.7" fill="#d4af37" />
    </svg>
  );
}

/** Small tricolour flag badge used in the government utility bar. */
export function FlagBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      width="26"
      height="17"
      className={className}
      role="img"
      aria-label="Flag of India"
    >
      <rect width="30" height="6.67" y="0" fill="#ff9933" />
      <rect width="30" height="6.67" y="6.67" fill="#ffffff" />
      <rect width="30" height="6.67" y="13.34" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="15" cy="10" r="0.55" fill="#000080" />
    </svg>
  );
}
