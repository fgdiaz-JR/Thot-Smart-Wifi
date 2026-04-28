import React, { useState, useRef, useEffect } from 'react';
import { Activity, MessageSquare, Map, AlertTriangle, Send, Settings, MapPin, Wifi, ZapOff, ClipboardList, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('operativo');
  const [urls, setUrls] = useState({ operativo: '', conversacional: '', estrategico: '' });
  const [showConfig, setShowConfig] = useState(true);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <Wifi className="w-6 h-6" />
            Thot Smart WiFi
          </h1>
          <p className="text-xs text-slate-500 mt-1">Panel de Control de IA</p>
        </div>
        <div className="flex-1 px-4 space-y-2">
          <NavItem icon={<Activity />} label="Centro Operativo" isActive={activeTab === 'operativo'} onClick={() => setActiveTab('operativo')} />
          <NavItem icon={<MessageSquare />} label="Asistente de Datos" isActive={activeTab === 'conversacional'} onClick={() => setActiveTab('conversacional')} />
          <NavItem icon={<Map />} label="Visor Estratégico" isActive={activeTab === 'estrategico'} onClick={() => setActiveTab('estrategico')} />
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setShowConfig(!showConfig)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors">
            <Settings className="w-4 h-4" /> Configurar APIs
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {showConfig && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-full max-w-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="text-blue-400" /> Endpoints de Cloud Functions</h2>
              <div className="space-y-4">
                <ConfigInput label="URL Agente Operativo" value={urls.operativo} onChange={(e) => setUrls({ ...urls, operativo: e.target.value })} />
                <ConfigInput label="URL Agente Conversacional" value={urls.conversacional} onChange={(e) => setUrls({ ...urls, conversacional: e.target.value })} />
                <ConfigInput label="URL Agente Estratégico" value={urls.estrategico} onChange={(e) => setUrls({ ...urls, estrategico: e.target.value })} />
              </div>
              <button onClick={() => setShowConfig(false)} className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-semibold">Conectar Agentes</button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'operativo' && <TabOperativo url={urls.operativo} />}
          {activeTab === 'conversacional' && <TabConversacional url={urls.conversacional} />}
          {activeTab === 'estrategico' && <TabEstrategico url={urls.estrategico} />}
        </div>
      </main>
    </div>
  );
}

function TabOperativo({ url }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const simularEscaneo = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      setAlertas([{ ...data, time: new Date().toLocaleTimeString() }, ...alertas]);
    } catch (e) {
      setAlertas([{ error: true, status: "Error de conexión", time: new Date().toLocaleTimeString() }, ...alertas]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Centro Operativo</h2>
          <p className="text-slate-400">Análisis proactivo e inteligencia de red</p>
        </div>
        <button onClick={simularEscaneo} disabled={loading} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> {loading ? 'Escaneando...' : 'Escanear Red'}
        </button>
      </header>

      <div className="space-y-4">
        {alertas.length === 0 && <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">No hay alertas recientes en el repositorio.</div>}
        {alertas.map((alerta, i) => (
          <div key={i} className={`p-6 rounded-xl border flex flex-col gap-4 ${alerta.error ? 'bg-red-900/20 border-red-800' : 'bg-slate-800/40 border-slate-700 shadow-lg'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${alerta.error ? 'bg-red-500/20' : 'bg-rose-500/20'}`}>
                  <AlertTriangle className={`w-6 h-6 ${alerta.error ? 'text-red-400' : 'text-rose-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{alerta.ap_id || "Falla de Sistema"}</h3>
                  <span className="text-xs text-rose-400 font-semibold uppercase">{alerta.status}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full">{alerta.time}</span>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-slate-300 leading-relaxed italic text-sm">
                "{alerta.mensaje || "Buscando diagnóstico..."}"
              </p>
            </div>

            {alerta.detalles && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-500"><span className="text-blue-400">IP:</span> {alerta.detalles.ip}</div>
                <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-500"><span className="text-blue-400">MAC:</span> {alerta.detalles.mac}</div>
                <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-500"><span className="text-blue-400">SERIAL:</span> {alerta.detalles.serial}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabConversacional({ url }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hola. Soy el asistente de datos. ¿Qué quieres consultar sobre el repositorio?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !url) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pregunta: userMsg }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.respuesta, sql: data.sql, datos: data.datos }]);
    } catch (err) { setMessages(prev => [...prev, { role: 'ai', text: `Error: ${err.message}` }]); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6"><h2 className="text-3xl font-bold text-white">Asistente de Datos</h2><p className="text-slate-400">Consultas inteligentes a BigQuery</p></header>
      <div className="flex-1 bg-slate-800/20 border border-slate-700 rounded-xl overflow-hidden flex flex-col mb-4 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-xl'}`}>
                <p className="text-sm">{m.text}</p>
                {m.sql && <div className="mt-3 bg-slate-950 p-3 rounded text-[10px] font-mono text-emerald-400 border border-slate-800"><div className="text-slate-500 mb-1">SQL EJECUTADO:</div>{m.sql}</div>}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex gap-2"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div></div></div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-slate-800 flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ej: ¿Qué AP tiene la mayor tasa de desconexión?" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" disabled={loading} />
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </div>
  );
}

function TabEstrategico({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarEstrategia = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: 'POST' });
      setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div><h2 className="text-3xl font-bold text-white">Visor Estratégico</h2><p className="text-slate-400">Recomendaciones de inversión basadas en BigQuery</p></div>
        <button onClick={cargarEstrategia} disabled={loading} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition">{loading ? 'Procesando...' : 'Generar Análisis'}</button>
      </header>
      {data && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-8 rounded-2xl shadow-2xl relative">
            <div className="absolute top-4 right-4 opacity-5"><MapPin className="w-32 h-32" /></div>
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><ZapOff className="w-5 h-5" /> Recomendación de la IA</h3>
            <p className="text-slate-200 text-lg leading-relaxed italic">"{data.recomendacion_ia}"</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.marcadores_mapa?.map((punto, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
                <div className="flex justify-between items-start mb-3"><MapPin className="text-rose-500" /><span className="text-[10px] font-bold px-2 py-1 bg-slate-900 rounded text-slate-400">PRIORIDAD {i + 1}</span></div>
                <h4 className="font-bold text-white mb-2">{punto.ap_id}</h4>
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Usuarios:</span><span className="text-white font-bold">{punto.prom_conexiones}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Inestabilidad:</span><span className="text-rose-400 font-bold">{punto.total_fallas} pts</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      {icon} {label}
    </button>
  );
}

function ConfigInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input type="url" value={value} onChange={onChange} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    </div>
  );
}
