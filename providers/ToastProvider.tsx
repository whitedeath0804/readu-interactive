import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import ToastView, { ToastItem, ToastOptions } from '../components/ui/Toast';

type ToastContextValue = {
  show: (opts: ToastOptions) => string; // returns id
  success: (title: string, desc?: string) => string;
  error: (title: string, desc?: string) => string;
  hide: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const hide = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts: ToastOptions) => {
    const id = `${Date.now()}-${idRef.current++}`;
    const item: ToastItem = {
      id,
      type: opts.type ?? 'info',
      title: opts.title,
      desc: opts.desc,
      duration: opts.duration ?? 3500,
      action: opts.action,
    };
    setItems((prev) => [item, ...prev].slice(0, 3));
    if (item.duration && item.duration > 0) {
      setTimeout(() => hide(id), item.duration);
    }
    return id;
  }, [hide]);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (title, desc) => show({ type: 'success', title, desc }),
    error: (title, desc) => show({ type: 'error', title, desc }),
    hide,
  }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastView items={items} onHide={hide} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;

