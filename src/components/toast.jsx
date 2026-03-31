import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import './toast.css'
const ToastContext = createContext(null);

let idCounter = 0;
function uid(){ return ++idCounter; }

export function ToastProvider({ children, max = 4, duration = 4500 }){
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = uid();
    setToasts(t => {
      const next = [{ id, ...toast }, ...t];
      return next.slice(0, max);
    });
    return id;
  }, [max]);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove, duration }}>
      {children}
      <ToastViewport toasts={toasts} remove={remove} duration={duration} />
    </ToastContext.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

function ToastViewport({ toasts, remove, duration }){
  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={() => remove(t.id)} duration={duration} />
      ))}
    </div>
  );
}

function Toast({ id, type = 'info', title, message, onClose, duration }){
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // show animation
    const enter = requestAnimationFrame(() => setVisible(true));
    // auto-dismiss
    timerRef.current = setTimeout(() => handleClose(), duration);
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    // wait for animation to finish
    setTimeout(() => onClose && onClose(), 220);
  }, [onClose]);

  return (
    <div className={`toast ${type} ${visible ? 'show' : ''}`} role="status" aria-live="polite">
      <div className="icon" aria-hidden>
        {type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {type === 'warn' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a1 1 0 0 0 .87 1.5h18.62a1 1 0 0 0 .87-1.5L13.71 3.86a1 1 0 0 0-.87-.5H11.16a1 1 0 0 0-.87.5z" strokeWidth="0"/></svg>}
        {type === 'info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM11 10h2v6h-2zm0-4h2v2h-2z" strokeWidth="0"/></svg>}
      </div>

      <div className="content">
        {title && <div className="title">{title}</div>}
        {message && <div className="message">{message}</div>}
      </div>

      <button className="close" aria-label="Close toast" onClick={handleClose}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
