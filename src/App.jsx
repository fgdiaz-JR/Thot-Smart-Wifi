import React, { useState, useRef, useEffect } from 'react';
import { Activity, MessageSquare, Map, AlertTriangle, Send, CheckCircle, Settings, MapPin, Wifi, ZapOff } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('operativo');

  // URLs de las Cloud Functions (Configurables)
  const [urls, setUrls] = useState({
    operativo: '',
    conversacional: '',
    estrategico: ''
  });

  const [showConfig, setShowConfig] = useState(true);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">Thot-Technology</div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wifi className="w-6 h-6 text-blue-400" />
            Thot Smart Wifi
          </h1>
          <p className="text-xs text-slate-500 mt-1">Panel de Control de IA</p>
        </div>

        <div className="flex-1 px-4 space-y-2">
          <NavItem
            icon={<Activity />}
            label="Centro Operativo"
            isActive={activeTab === 'operativo'}
            onClick={() => setActiveTab('operativo')}
          />
          <NavItem
            icon={<MessageSquare />}
            label="Asistente de Datos"
            isActive={activeTab === 'conversacional'}
            onClick={() => setActiveTab('conversacional')}
          />
          <NavItem
            icon={<Map />}
            label="Visor Estratégico"
            isActive={activeTab === 'estrategico'}
            onClick={() => setActiveTab('estrategico')}
          />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configurar APIs
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Config Modal Overlay */}
        {showConfig && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-full max-w-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="text-blue-400" />
                Configuración de Endpoints
              </h2>
              <p className="text-sm text-slate-400 mb-6">Pega aquí las URLs de tus Cloud Functions para conectar el Dashboard.</p>

              <div className="space-y-4">
                <ConfigInput label="URL Agente Operativo" value={urls.operativo} onChange={(e) => setUrls({ ...urls, operativo: e.target.value })} />
                <ConfigInput label="URL Agente Conversacional" value={urls.conversacional} onChange={(e) => setUrls({ ...urls, conversacional: e.target.value })} />
                <ConfigInput label="URL Agente Estratégico" value={urls.estrategico} onChange={(e) => setUrls({ ...urls, estrategico: e.target.value })} />
              </div>

              <button
                onClick={() => setShowConfig(false)}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition-colors"
              >
                Conectar Agentes
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'operativo' && <TabOperativo url={urls.operativo} />}
          {activeTab === 'conversacional' && <TabConversacional url={urls.conversacional} />}
          {activeTab === 'estrategico' && <TabEstrategico url={urls.estrategico} />}
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTES DE LAS TABS ---

function TabOperativo({ url }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const simularEscaneo = async () => {
    if (!url) return alert("Por favor configura la URL del Agente Operativo.");
    setLoading(true);
    try {
      // Simulamos enviar el payload de un AP aleatorio
      const payload = { ap_id: `AP-Cali-${Math.floor(Math.random() * 100)}`, conexiones_activas: Math.floor(Math.random() * 15), umbral_minimo: 20 };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setAlertas([{ ...data, ...payload, time: new Date().toLocaleTimeString() }, ...alertas]);
    } catch (e) {
      setAlertas([{ error: true, status: "Error de conexión con la Cloud Function", time: new Date().toLocaleTimeString() }, ...alertas]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Centro Operativo</h2>
          <p className="text-slate-400">Detección de anomalías y automatización de tickets</p>
        </div>
        <button
          onClick={simularEscaneo}
          disabled={loading}
          className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded hover:bg-red-500/20 transition flex items-center gap-2"
        >
          {loading ? 'Escaneando...' : 'Simular Anomalía de Red'}
        </button>
      </header>

      <div className="space-y-4">
        {alertas.length === 0 && (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
            Sistema monitoreando. No hay alertas recientes.
          </div>
        )}
        {alertas.map((alerta, i) => (
          <div key={i} className={`p-4 rounded-lg border flex items-start gap-4 ${alerta.error ? 'bg-red-900/20 border-red-800' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className={`p-2 rounded-full ${alerta.error ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
              <AlertTriangle className={`w-6 h-6 ${alerta.error ? 'text-red-400' : 'text-orange-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-slate-200">{alerta.ap_id || "Falla del Sistema"}</h3>
                <span className="text-xs text-slate-500">{alerta.time}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{alerta.status}</p>
              {!alerta.error && alerta.conexiones_activas !== undefined && (
                <div className="mt-3 flex gap-4 text-xs font-mono text-slate-500">
                  <span className="bg-slate-900 px-2 py-1 rounded">Conexiones: {alerta.conexiones_activas}</span>
                  <span className="bg-slate-900 px-2 py-1 rounded">Umbral: {alerta.umbral_minimo}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabConversacional({ url }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hola. Soy el agente conversacional de datos. ¿Qué quieres saber sobre el rendimiento técnico de las zonas WiFi?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!url) return alert("Por favor configura la URL del Agente Conversacional.");

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta: userMsg })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Consulta exitosa.',
        sql: data.sql,
        evidencia: data.evidencia
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-white">Asistente de Datos</h2>
        <p className="text-slate-400">Interacción Text-to-SQL usando Gemini</p>
      </header>

      <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden flex flex-col mb-4 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                <p>{m.text}</p>
                {m.sql && (
                  <div className="mt-3 bg-slate-950 p-3 rounded text-xs font-mono text-green-400 overflow-x-auto border border-slate-700">
                    <div className="text-slate-500 mb-1 border-b border-slate-800 pb-1">SQL Ejecutado:</div>
                    {m.sql}
                  </div>
                )}
                {m.evidencia && m.evidencia.length > 0 && (
                  <div className="mt-3 w-full overflow-x-auto bg-slate-900 rounded border border-slate-700">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                        <tr>
                          {Object.keys(m.evidencia[0]).map(k => <th key={k} className="px-3 py-2">{k}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {m.evidencia.map((row, idx) => (
                          <tr key={idx} className="border-t border-slate-800">
                            {Object.values(row).map((val, vIdx) => <td key={vIdx} className="px-3 py-2">{String(val)}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                <span className="ml-2 text-sm">Consultando BigQuery...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: ¿Cuál es el AP con peor rendimiento esta semana?"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function TabEstrategico({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarEstrategia = async () => {
    if (!url) return alert("Por favor configura la URL del Agente Estratégico.");
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url, { method: 'POST' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Visor Estratégico</h2>
          <p className="text-slate-400">Cruces geoespaciales y recomendaciones de inversión</p>
        </div>
        <button
          onClick={cargarEstrategia}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition flex items-center gap-2"
        >
          {loading ? 'Analizando Territorio...' : 'Ejecutar Análisis de Inversión'}
        </button>
      </header>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel IA */}
          <div className="lg:col-span-3 bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Map className="w-32 h-32" />
            </div>
            <h3 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
              <ZapOff className="w-5 h-5" /> Dictamen de la IA (Gemini)
            </h3>
            <p className="text-slate-200 text-lg leading-relaxed relative z-10">
              {data.recomendacion_ia}
            </p>
          </div>

          {/* Tarjetas de Puntos Críticos */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-slate-300 mb-4">Top 3 Zonas Críticas (Intervención Prioritaria)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.marcadores_mapa?.map((punto, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-blue-500/50 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <MapPin className="text-rose-400 w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-rose-500/20 text-rose-400 rounded">Prioridad {i + 1}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-lg mb-1">{punto.ap_id}</h4>
                  <div className="text-sm text-slate-400 font-mono mb-4">
                    {Number(punto.latitud).toFixed(4)}, {Number(punto.longitud).toFixed(4)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                      <span className="text-slate-500">Prom. Conexiones</span>
                      <span className="text-slate-300 font-semibold">{Number(punto.prom_conexiones).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-500">Fallas Autenticación</span>
                      <span className="text-rose-400 font-bold">{punto.total_fallas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl text-slate-500">
          Haz clic en "Ejecutar Análisis" para evaluar la red WiFi de Cali.
        </div>
      )}
    </div>
  );
}

// --- UTILS ---
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ConfigInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input
        type="url"
        value={value}
        onChange={onChange}
        placeholder="https://..."
        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
      />
    </div>
  );
}