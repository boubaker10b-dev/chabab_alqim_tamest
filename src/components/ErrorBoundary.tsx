import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.removeItem('tamest_auth_user');
      localStorage.removeItem('tamest_static_members');
      localStorage.removeItem('tamest_static_cohorts');
      localStorage.removeItem('tamest_static_supervisors');
      localStorage.removeItem('tamest_static_photos');
      localStorage.removeItem('tamest_static_logs');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center p-4 text-[#111e1a] font-sans" dir="rtl">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ba1a1a]/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h1 className="text-2xl font-black text-[#003a29] mb-2">
              حدث خطأ أثناء تحميل الصفحة
            </h1>

            <p className="text-sm text-[#404944] leading-relaxed mb-6">
              تم رصد مشكلة تقنية بسيطة تمنع عرض الصفحة بشكل صحيح. يمكنك المحاولة مجدداً أو إعادة ضبط البيانات المؤقتة.
            </p>

            {this.state.error && (
              <div className="bg-[#f2f4f2] rounded-xl p-3 text-xs text-left font-mono text-[#ba1a1a] mb-6 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#003a29] text-white font-bold text-sm shadow hover:bg-[#0d533d] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-bold text-sm hover:bg-[#ffb4ab] transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>مسح الذاكرة المؤقتة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
