'use client';

import { ReactNode, useEffect } from 'react';

interface ExpansionModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    noPadding?: boolean;
}

export default function ExpansionModal({ open, onClose, children, title, noPadding = false }: ExpansionModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:pl-80">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white/98 dark:bg-slate-900 rounded-[1.75rem] shadow-2xl overflow-hidden border border-gray-200/40 flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/60 bg-white/90 dark:bg-slate-800/80 backdrop-blur shrink-0">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title ?? 'Perbesar Tampilan'}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={`flex-1 w-full overflow-hidden ${noPadding ? '' : 'p-4 md:p-6'}`}>
                    {noPadding ? (
                        children
                    ) : (
                        <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
