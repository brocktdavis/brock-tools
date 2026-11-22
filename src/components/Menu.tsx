import { useId, useRef, useState, type MouseEvent, type ReactNode } from "react";

import "./Menu.css";

export type MenuItem = {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
};

type MenuProps = {
  label: string;
  menuContent?: ReactNode;
}

export const Menu = ({ label, menuContent }: MenuProps) => {
  const [ open, setOpen ] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click (composedPath also works inside a shadow root)
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !e.composedPath().includes(rootRef.current)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div className="menu" ref={rootRef}>
      {/* TODO: add custom label component as prop */}
      <button
        type="button"
        className="action-btn"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>
      { open && (
        <div className="menu-panel" id={panelId} role="menu">
          {menuContent}
        </div>
      )}
    </div>
  );
};
