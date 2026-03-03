'use client';

import { useMemo, useState } from 'react';

type OrchestratorResult = any;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

function pretty(obj: any) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function Page() {
  const [idea, setIdea] = useState('SaaS para academias gerenciarem alunos e pagamentos');
  const [startupId, setStartupId] = useState<string>('1');

  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [orchestratorResult, setOrchestratorResult] = useState<OrchestratorResult | null>(null);
  const [savedStartup, setSavedStartup] = useState<any | null>(null);
  const [savedAssets, setSavedAssets] = useState<any | null>(null);

  const landingUrl = useMemo(() => {
    const id = (savedStartup?.id || startupId || '').toString().trim();
    if (!id) return '';
    return `${API_BASE}/api/startup/${id}/landing`;
  }, [startupId, savedStartup]);

  async function api(path: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    const resp = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = resp.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    const data = isJson ? await resp.json().catch(() => null) : await resp.text().catch(() => null);

    if (!resp.ok) {
      const msg =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        (typeof data === 'string' ? data : null) ||
        `HTTP ${resp.status}`;
      throw new Error(msg);
    }

    return data;
  }

  async function runOrchestrator() {
    setLoading(true);
    setLastAction('Executando Orchestrator...');
    setError('');
    try {
      const data = await api('/api/orchestrator/create-startup', 'POST', { idea });
      setOrchestratorResult(data?.result ?? data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao executar orchestrator');
    } finally {
      setLoading(false);
      setLastAction('');
    }
  }

  async function generateAndSaveStartup() {
    setLoading(true);
    setLastAction('Gerando e salvando startup...');
    setError('');
    try {
      const data = await api('/api/startup/generate-and-save', 'POST', { idea });
      // seu backend retorna { success, saved: { id, idea, startup, created_at... } }
      const saved = data?.saved;
      if (saved?.id) setStartupId(String(saved.id));
      setSavedStartup(saved);
    } catch (e: any) {
      setError(e?.message || 'Erro ao gerar e salvar startup');
    } finally {
      setLoading(false);
      setLastAction('');
    }
  }

  async function generateAssets() {
    setLoading(true);
    setLastAction('Gerando assets...');
    setError('');
    try {
      const id = (savedStartup?.id || startupId || '').toString().trim();
      if (!id) throw new Error('Informe um Startup ID válido.');

      const data = await api(`/api/startup/${id}/generate-assets`, 'POST', {});
      setSavedAssets(data?.assets ?? data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao gerar assets');
    } finally {
      setLoading(false);
      setLastAction('');
    }
  }

  function openLanding() {
    if (!landingUrl) return;
    window.open(landingUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-zinc-400">AI Startup Factory</div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dashboard (MVP)
          </h1>
          <p className="text-zinc-300">
            Gere uma startup completa (Orchestrator), salve no banco e crie uma landing page automaticamente.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Entrada */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-lg font-semibold">1) Ideia</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Digite a ideia que você quer transformar em startup.
            </p>

            <textarea
              className="mt-4 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
              rows={5}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={runOrchestrator}
                disabled={loading}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
              >
                {loading ? 'Processando...' : 'Gerar Startup Completa (Orchestrator)'}
              </button>

              <button
                onClick={generateAndSaveStartup}
                disabled={loading}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-900 disabled:opacity-60"
              >
                {loading ? 'Processando...' : 'Gerar e Salvar no Banco'}
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Startup ID</div>
                  <div className="text-xs text-zinc-400">
                    Use o ID salvo para gerar assets e abrir landing
                  </div>
                </div>

                <input
                  className="w-24 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
                  value={startupId}
                  onChange={(e) => setStartupId(e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={generateAssets}
                  disabled={loading}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-900 disabled:opacity-60"
                >
                  {loading ? 'Processando...' : 'Gerar Assets (Landing + etc)'}
                </button>

                <button
                  onClick={openLanding}
                  disabled={!landingUrl}
                  className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-200 disabled:opacity-60"
                >
                  Abrir Landing no Navegador
                </button>

                <div className="text-xs text-zinc-400 break-all">
                  Landing: {landingUrl || '—'}
                </div>
              </div>
            </div>

            {lastAction && (
              <div className="mt-4 text-sm text-zinc-300">
                {lastAction}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/40 p-3 text-sm text-red-200">
                <div className="font-semibold">Erro</div>
                <div className="mt-1 whitespace-pre-wrap">{error}</div>
              </div>
            )}
          </div>

          {/* Saídas */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-lg font-semibold">2) Resultados</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Aqui aparecem os retornos do Orchestrator, do save e dos assets.
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-sm font-semibold">Orchestrator</div>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-zinc-200">
                  {orchestratorResult ? pretty(orchestratorResult) : '—'}
                </pre>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-sm font-semibold">Startup salva</div>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-zinc-200">
                  {savedStartup ? pretty(savedStartup) : '—'}
                </pre>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-sm font-semibold">Assets gerados</div>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-zinc-200">
                  {savedAssets ? pretty(savedAssets) : '—'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          Backend esperado em: <span className="text-zinc-300">{API_BASE}</span> • Dica: mantenha o backend rodando em <span className="text-zinc-300">http://localhost:5000</span>
        </div>
      </div>
    </main>
  );
}