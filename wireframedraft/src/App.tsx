/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Footer } from './components/Footer';
import { ArticleAnalyzerScreen } from './components/ArticleAnalyzerScreen';
import { ModelBenchmarkScreen } from './components/ModelBenchmarkScreen';
import { DatasetPipelineScreen } from './components/DatasetPipelineScreen';
import { ApiExportScreen } from './components/ApiExportScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('article-url-analyzer');
  const [toastMessage, setToastMessage] = useState<string>('Telemetry Data Exported to Clipboard.');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const toastTimeoutRef = useRef<number | null>(null);

  // Global Theme Mode State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('truthlens-theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('truthlens-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      handleShowToast(`Theme switched to ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
      return next;
    });
  }, []);

  const handleShowToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  }, []);

  const handleSelectTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col transition-colors duration-200">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onShowToast={handleShowToast}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="w-full pt-24 bg-surface min-h-screen flex-1 transition-colors duration-200">
        {activeTab === 'article-url-analyzer' && (
          <ArticleAnalyzerScreen onShowToast={handleShowToast} />
        )}
        {activeTab === 'model-benchmark-matrix' && (
          <ModelBenchmarkScreen
            onShowToast={handleShowToast}
            onSelectTab={handleSelectTab}
          />
        )}
        {activeTab === 'dataset-transparency-pipeline' && (
          <DatasetPipelineScreen onShowToast={handleShowToast} />
        )}
        {activeTab === 'api-export' && (
          <ApiExportScreen onShowToast={handleShowToast} />
        )}
      </main>

      <Footer onSelectTab={handleSelectTab} onShowToast={handleShowToast} />

      {/* Notification Toast Container */}
      <div
        id="toast"
        className={`fixed bottom-6 right-6 z-50 transform transition-transform duration-300 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded shadow-2xl flex items-center gap-space-sm pointer-events-none ${
          toastVisible ? 'translate-y-0' : 'translate-y-32'
        }`}
      >
        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
          check_circle
        </span>
        <span className="font-label-md text-label-md font-mono" id="toast-message">
          {toastMessage}
        </span>
      </div>
    </div>
  );
}
