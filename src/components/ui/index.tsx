import React, { useEffect } from "react";
import { cn } from "../../lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className,
}) => {
  const variants = {
    default: "bg-[#f0f3f9] text-[#3d4663]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    outline: "border border-[#dde3f0] text-[#3d4663] bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = "md",
}) => {
  const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#dde3f0] premium-shadow",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl animate-fade-up",
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3f0]">
            <h3 className="text-lg font-semibold text-[#0a1628]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#f0f3f9] text-[#6b7a9e] hover:text-[#0a1628] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <svg
      className={cn("animate-spin text-[#2952a3]", sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

// ─── PageLoader ───────────────────────────────────────────────────────────────
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-[#6b7a9e]">Loading...</p>
    </div>
  </div>
);

// ─── ErrorMessage ─────────────────────────────────────────────────────────────
interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
    <div className="p-4 rounded-full bg-red-50">
      <AlertCircle size={32} className="text-red-500" />
    </div>
    <p className="text-[#3d4663] text-center max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-[#152b55] rounded-lg hover:bg-[#0f2040] transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const configs = {
    success: {
      icon: <CheckCircle size={18} />,
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
    },
    error: {
      icon: <AlertCircle size={18} />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
    },
    info: {
      icon: <Info size={18} />,
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
    },
    warning: {
      icon: <AlertTriangle size={18} />,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
    },
  };

  const config = configs[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-fade-up",
        config.bg,
        config.text
      )}
    >
      {config.icon}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

// ─── ToastContainer ───────────────────────────────────────────────────────────
interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
    {toasts.map((t) => (
      <Toast
        key={t.id}
        message={t.message}
        type={t.type}
        onClose={() => removeToast(t.id)}
      />
    ))}
  </div>
);

// ─── StatusBadge ──────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    pending: { variant: "warning", label: "Pending" },
    confirmed: { variant: "info", label: "Confirmed" },
    processing: { variant: "info", label: "Processing" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "danger", label: "Cancelled" },
    active: { variant: "success", label: "Active" },
    inactive: { variant: "danger", label: "Inactive" },
  };
  const config = map[status.toLowerCase()] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    {icon && (
      <div className="p-4 rounded-full bg-[#f0f3f9] text-[#6b7a9e]">{icon}</div>
    )}
    <div className="text-center">
      <h3 className="font-semibold text-[#0a1628] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#6b7a9e] max-w-xs">{description}</p>
      )}
    </div>
    {action}
  </div>
);
