import React, { useState, useEffect, useRef } from 'react';
const VERSION_LOCAL = "9.0.1"; // Identificador de esta versión
import { 
  Settings, ChevronLeft, ChevronRight, 
  Trash2, Upload, Save, Info, ArrowLeft, X, Calendar, Check
} from 'lucide-react';

// --- ESTILOS GLOBALES  ---
const globalStyles = `
  :root {
    color-scheme: light !important; 
    --bg-app: #F0F2F5;
    --bg-card: #FFFFFF;
    --text-primary: #2D408F;
    --text-secondary: #AAAAAA;
    --border-color: #EEEEEE;
    --btn-bg: #F8F9FA;
    --btn-text: #2D408F;
    --safe-bottom: env(safe-area-inset-bottom, 30px);
  }

  html, body { 
    margin: 0; padding: 0; 
    width: 100%; height: 100%;
    background-color: var(--bg-app);
    color: #000000;
    overflow: hidden; 
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  #root { 
    height: 100%; 
    width: 100%; 
    display: flex; 
    justify-content: center; 
    align-items: center;
  }

  .app-container {
    width: 100%;
    height: 100%;
    background-color: var(--bg-card);
    display: flex; 
    flex-direction: column; 
    overflow: hidden;
    position: relative;
    padding-bottom: var(--safe-bottom);
  }

  @media (min-width: 600px) {
    .app-container {
      max-width: 480px; 
      height: 95vh;
      max-height: 900px;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      border: 1px solid rgba(0,0,0,0.05);
    }
  }

  input, textarea, select {
    background-color: #FFFFFF !important;
    color: #000000 !important;
    border: 1px solid #DDDDDD !important;
    opacity: 1 !important;
  }

  input[type="color"] {
    opacity: 0 !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .modal-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    backdrop-filter: blur(3px);
  }
  
  .modal-content {
    width: 90%;
    max-width: 340px;
    background-color: var(--bg-card);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .fade-in { animation: fadeIn 0.2s ease-out; }
  @keyframes fadeIn { from { opacity: 0.95; } to { opacity: 1; } }
`;

const App = () => {
  // --- SISTEMA DE ACTUALIZACIÓN ---
  const [hayNuevaVersion, setHayNuevaVersion] = useState(false);

  useEffect(() => {
    const comprobarActualizacion = async () => {
      try {
const URL_VERSION = "https://raw.githubusercontent.com/JavierVenero/custodiapp-hij-s/main/src/version.json");        const datos = await respuesta.json();
        if (datos.version !== VERSION_LOCAL) {
          setHayNuevaVersion(true);
        }
      } catch (error) {
        console.log("Error al comprobar versión remoto");
      }
    };
    comprobarActualizacion();
  }, []);

  // --- ESTADOS DE LA APP ---
  const [vista, setVista] = useState('Calendario');
  const [fechaVisualizacion, setFechaVisualizacion] = useState(new Date());

  const getHoyISO = () => new Date().toISOString().split('T')[0];

  const [misColores, setMisColores] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem('custodia_colores'));
      if (c && c.con && c.sin) return c;
      return { con: '#76B852', sin: '#FF9800' };
    } catch { return { con: '#76B852', sin: '#FF9800' }; }
  });

  const [cicloPersonalizado, setCicloPersonalizado] = useState(() => {
    try { return JSON.parse(localStorage.getItem('custodia_ciclo')) || Array(14).fill(true); } catch { return Array(14).fill(true); }
  });

  const [inicioCicloStr, setInicioCicloStr] = useState(() => localStorage.getItem('custodia_inicio_ciclo') || getHoyISO());

  const [excepciones, setExcepciones] = useState(() => {
    try { return JSON.parse(localStorage.getItem('custodia_notas')) || {}; } catch { return {}; }
  });

  const [vacaciones, setVacaciones] = useState(() => {
    try { return JSON.parse(localStorage.getItem('custodia_vacaciones')) || []; } catch { return []; }
  });

  const [convenio, setConvenio] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('custodia_convenio_reglas')) || {};
      return { 
        ss_par: s.ss_par || 'con', ss_inicio: s.ss_inicio || '', ss_fin: s.ss_fin || '', ss_detalle: s.ss_detalle || {},
        julio_par: s.julio_par || null, agosto_par: s.agosto_par || null, 
        navidad_par: s.navidad_par || 'con', navidad_inicio: s.navidad_inicio || '', navidad_fin: s.navidad_fin || '', navidad_detalle: s.navidad_detalle || {}
      };
    } catch { return { ss_par: 'con', ss_inicio: '', ss_fin: '', ss_detalle: {}, julio_par: null, agosto_par: null, navidad_par: 'con', navidad_inicio: '', navidad_fin: '', navidad_detalle: {} }; }
  });

  const [aplicarConvenio, setAplicarConvenio] = useState(() => {
    const saved = localStorage.getItem('custodia_aplicar_convenio');
    return saved !== null ? saved === 'true' : true;
  });

  const [tutorialCompletado, setTutorialCompletado] = useState(() => {
      return localStorage.getItem('custodia_tutorial_ok') === 'true';
  });
  const [pasoTutorial, setPasoTutorial] = useState(1);

  const hoyISO = new Date().toISOString().split('T')[0];
  const [vacaInicio, setVacaInicio] = useState(hoyISO);
  const [vacaFin, setVacaFin] = useState(hoyISO);
  const [vacaTipo, setVacaTipo] = useState('con');
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [textoExcepcion, setTextoExcepcion] = useState('');
  const [fechaBusqueda, setFechaBusqueda] = useState('');
  const [modalConvenio, setModalConvenio] = useState(null); 
  const [excepFecha, setExcepFecha] = useState(hoyISO);
  const [excepNota, setExcepNota] = useState('');
  const [confirmarReset, setConfirmarReset] = useState(false);

  const fileInputRef = useRef(null);
  const hoy = new Date();
  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const diasPatron = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  
  const anioActual = hoy.getFullYear();

  useEffect(() => {
    localStorage.setItem('custodia_colores', JSON.stringify(misColores));
    localStorage.setItem('custodia_ciclo', JSON.stringify(cicloPersonalizado));
    localStorage.setItem('custodia_inicio_ciclo', inicioCicloStr);
    localStorage.setItem('custodia_notas', JSON.stringify(excepciones));
    localStorage.setItem('custodia_vacaciones', JSON.stringify(vacaciones));
    localStorage.setItem('custodia_convenio_reglas', JSON.stringify(convenio));
    localStorage.setItem('custodia_aplicar_convenio', String(aplicarConvenio));
    if (tutorialCompletado) localStorage.setItem('custodia_tutorial_ok', 'true');
  }, [misColores, cicloPersonalizado, inicioCicloStr, excepciones, vacaciones, convenio, aplicarConvenio, tutorialCompletado]);

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

  const LabelEstado = ({ tipo, scale = 1, colorOverride = null }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px', lineHeight: '1' }}>
      <span style={{ fontSize: `${14 * scale}px`, fontWeight: '900', letterSpacing: '0.5px', color: colorOverride || 'inherit' }}>{tipo === 'con' ? 'CON' : 'SIN'}</span>
      <span style={{ fontSize: `${11 * scale}px`, fontWeight: '800', opacity: 0.95, color: colorOverride || 'inherit' }}>NIÑ@S</span>
    </div>
  );

  const getTextoParaFondo = (hex) => {
    if (!hex || typeof hex !== 'string' || hex.length < 7) return '#000'; 
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16), g = parseInt(clean.substring(2, 4), 16), b = parseInt(clean.substring(4, 6), 16);
    return ((r * 299 + g * 587 + b * 114) / 1000) >= 180 ? '#000' : '#FFF';
  };

  const getEstadoDia = (f) => {
    const fDate = new Date(f.getFullYear(), f.getMonth(), f.getDate());
    const id = fDate.toDateString();
    const idISO = fDate.toISOString().split('T')[0];
    const year = fDate.getFullYear();
    const month = fDate.getMonth();
    const day = fDate.getDate();
    const isPar = year % 2 === 0;
    
    if (excepciones[id]?.estado) return excepciones[id].estado === 'con';
    
    const ft = fDate.getTime();
    for (let v of vacaciones) {
      if (ft >= new Date(v.inicio).setHours(0,0,0,0) && ft <= new Date(v.fin).setHours(0,0,0,0)) return v.tipo === 'con';
    }

    if (aplicarConvenio) {
        if (convenio.ss_inicio && convenio.ss_fin && ft >= new Date(convenio.ss_inicio).setHours(0,0,0,0) && ft <= new Date(convenio.ss_fin).setHours(0,0,0,0)) {
            let estadoBase = convenio.ss_par === 'con';
            if (convenio.ss_detalle && convenio.ss_detalle[idISO]) estadoBase = convenio.ss_detalle[idISO] === 'con';
            return isPar ? estadoBase : !estadoBase;
        }
        if (convenio.navidad_inicio && convenio.navidad_fin && ft >= new Date(convenio.navidad_inicio).setHours(0,0,0,0) && ft <= new Date(convenio.navidad_fin).setHours(0,0,0,0)) {
            let effectiveYear = month === 0 ? year - 1 : year;
            const isEffectivePar = effectiveYear % 2 === 0;
            let estadoBase = convenio.navidad_par === 'con';
            if (convenio.navidad_detalle && convenio.navidad_detalle[idISO]) estadoBase = convenio.navidad_detalle[idISO] === 'con';
            return isEffectivePar ? estadoBase : !estadoBase;
        }
        if (month === 6 && convenio.julio_par) {
            const esPrimera = day <= 15;
            return isPar ? (esPrimera ? convenio.julio_par==='con' : convenio.julio_par!=='con') : (esPrimera ? convenio.julio_par!=='con' : convenio.julio_par==='con');
        }
        if (month === 7 && convenio.agosto_par) {
            const esPrimera = day <= 15;
            return isPar ? (esPrimera ? convenio.agosto_par==='con' : convenio.agosto_par!=='con') : (esPrimera ? convenio.agosto_par!=='con' : convenio.agosto_par==='con');
        }
    }

    const ref = new Date(inicioCicloStr);
    ref.setHours(0,0,0,0);
    const diffDays = Math.round((fDate.getTime() - ref.getTime()) / 86400000);
    let pos = diffDays % 14;
    if (pos < 0) pos += 14;
    return cicloPersonalizado[pos];
  };

  const getCeldas = (any, mes) => {
    const p = new Date(any, mes, 1).getDay();
    const inicio = p === 0 ? 6 : p - 1;
    const total = new Date(any, mes + 1, 0).getDate();
    const res = [];
    const ultimoMesAnterior = new Date(any, mes, 0).getDate();
    for (let i = inicio; i > 0; i--) res.push({ d: ultimoMesAnterior - i + 1, m: -1, f: new Date(any, mes - 1, ultimoMesAnterior - i + 1) });
    for (let i = 1; i <= total; i++) res.push({ d: i, m: 0, f: new Date(any, mes, i) });
    let ds = 1;
    while (res.length % 7 !== 0) { res.push({ d: ds, m: 1, f: new Date(any, mes + 1, ds) }); ds++; }
    return res;
  };

  const getDiasRango = (inicio, fin) => {
    if (!inicio || !fin) return [];
    const start = new Date(inicio);
    const end = new Date(fin);
    const days = [];
    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
        count++;
        if(count > 45) break; 
    }
    return days;
  };

  const handleDateChange = (e, setter) => { setter(e.target.value); e.target.blur(); };
  const handleIrAFecha = (e) => {
    const val = e.target.value; setFechaBusqueda(val);
    if (val) { const [y, m, d] = val.split('-'); setFechaVisualizacion(new Date(parseInt(y), parseInt(m) - 1, parseInt(d))); e.target.blur(); }
  };

  const addExcepcionManual = (tipo) => {
    if (!excepFecha) return;
    vibrate();
    const dateObj = new Date(excepFecha);
    const id = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000).toDateString();
    setExcepciones({ ...excepciones, [id]: { nota: excepNota, estado: tipo } });
    setExcepNota('');
  };

  const toggleDiaSS = (fechaISO) => {
    const estadoActual = convenio.ss_detalle?.[fechaISO] || (convenio.ss_par === 'con' ? 'con' : 'sin');
    const nuevoEstado = estadoActual === 'con' ? 'sin' : 'con';
    setConvenio({ ...convenio, ss_detalle: { ...convenio.ss_detalle, [fechaISO]: nuevoEstado } });
  };

  const toggleDiaNavidad = (fechaISO) => {
    const estadoActual = convenio.navidad_detalle?.[fechaISO] || (convenio.navidad_par === 'con' ? 'con' : 'sin');
    const nuevoEstado = estadoActual === 'con' ? 'sin' : 'con';
    setConvenio({ ...convenio, navidad_detalle: { ...convenio.navidad_detalle, [fechaISO]: nuevoEstado } });
  };

  const handleExportarDatos = async () => {
    vibrate();
    const datosBackup = { colores: misColores, ciclo: cicloPersonalizado, inicio_ciclo: inicioCicloStr, notas: excepciones, vacaciones: vacaciones, convenio: convenio, aplicarConvenio: aplicarConvenio, fecha_backup: new Date().toISOString() };
    const dataStr = JSON.stringify(datosBackup, null, 2);
    
    if (navigator.share) {
        try {
            const file = new File([dataStr], "custodia_backup.json", { type: "application/json" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Copia de Seguridad CustodiApp',
                    text: 'Guarda este archivo en Drive o envíatelo por email.'
                });
                return;
            }
        } catch (e) { console.log("Share failed"); }
    }
    try {
        await navigator.clipboard.writeText(dataStr);
        alert("📋 Copia guardada en el PORTAPAPELES.");
    } catch (err) { alert("❌ No se pudo exportar."); }
  };

  const handleImportarDatos = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.colores && json.ciclo && json.inicio_ciclo) {
          if (window.confirm("¿Restaurar copia de seguridad?")) {
            vibrate();
            setMisColores(json.colores); setCicloPersonalizado(json.ciclo); setInicioCicloStr(json.inicio_ciclo); setExcepciones(json.notas || {}); setVacaciones(json.vacaciones || []); setConvenio(json.convenio || {});
            if (json.aplicarConvenio !== undefined) setAplicarConvenio(json.aplicarConvenio);
            setTutorialCompletado(true);
            alert("✅ Datos restaurados.");
          }
        } else { alert("⚠️ Archivo inválido."); }
      } catch { alert("❌ Error."); }
    };
    reader.readAsText(fileObj);
    event.target.value = null; 
  };

  const estiloBtnConvenio = (activo, tipo) => ({
    flex: 1, padding: '12px', borderRadius: '8px', 
    border: activo ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
    backgroundColor: tipo === 'con' ? misColores.con : misColores.sin,
    color: getTextoParaFondo(tipo === 'con' ? misColores.con : misColores.sin),
    fontWeight: activo ? '900' : 'normal', opacity: activo ? 1 : 0.6, fontSize: '13px', cursor: 'pointer',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  });

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app-container">
          
          {/* BANNER DE ACTUALIZACIÓN */}
          {hayNuevaVersion && (
            <div style={{ position: 'fixed', top: '20px', left: '20px', right: '20px', backgroundColor: '#76B852', color: 'white', padding: '15px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 99999 }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>¡Nueva versión disponible!</span>
              <button onClick={() => window.location.reload()} style={{ background: 'white', border: 'none', color: '#76B852', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ACTUALIZAR</button>
            </div>
          )}

          {!tutorialCompletado && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 9999, backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', padding: '30px', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(45, 64, 143, 0.2)', overflow: 'hidden', border: '3px solid white' }}>
                        <img src="/custodiapp_logo_oficial.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>¡Hola!</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '5px' }}>Configuremos tu calendario en segundos.</p>
                </div>
                {pasoTutorial === 1 && (
                    <div style={{ width: '100%', textAlign: 'center' }} className="fade-in">
                        <input type="date" value={inicioCicloStr} onChange={e => setInicioCicloStr(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '16px', textAlign: 'center', marginBottom: '30px', color: 'var(--text-primary)', fontWeight: 'bold' }} />
                        <button onClick={() => { vibrate(); setPasoTutorial(2); }} style={{ width: '100%', padding: '15px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 5px 15px rgba(45, 64, 143, 0.3)' }}>SIGUIENTE ➔</button>
                    </div>
                )}
                {pasoTutorial === 2 && (
                    <div style={{ width: '100%', textAlign: 'center' }} className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '30px' }}>
                            {cicloPersonalizado.map((v, i) => (
                                <button key={i} onClick={() => { vibrate(); const n = [...cicloPersonalizado]; n[i] = !n[i]; setCicloPersonalizado(n); }} style={{ aspectRatio: '1', borderRadius: '8px', border: 'none', background: v ? misColores.con : misColores.sin, color: getTextoParaFondo(v ? misColores.con : misColores.sin), cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '2px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: '900', marginBottom: '2px' }}>{diasPatron[i % 7]}</span>
                                    <LabelEstado tipo={v ? 'con' : 'sin'} scale={0.7} />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => { vibrate(); setTutorialCompletado(true); localStorage.setItem('custodia_tutorial_ok', 'true'); }} style={{ width: '100%', padding: '15px', backgroundColor: '#76B852', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 5px 15px rgba(118, 184, 82, 0.3)' }}>¡TERMINAR! 🎉</button>
                    </div>
                )}
            </div>
          )}

          <header style={{ padding: '50px 15px 15px 15px', borderBottom: '1px solid var(--border-color)', flexShrink: 0, backgroundColor: 'var(--bg-card)', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
                    <img src="/image2.png" alt="Logo" style={{ width: '105%', height: '105%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: '0', lineHeight: 1 }}>CustodiApp</h1>
                  <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.5px' }}>HIJ@S</p>
                </div>
              </div>
            </div>
            <nav style={{ display: 'flex', gap: '4px' }}>
              {['Calendario', 'Año', 'Vacac.', 'Excep.', 'Ajustes'].map(v => (
                <button key={v} onClick={() => { vibrate(); setVista(v); }} style={{ flex: v === 'Calendario' ? 1.4 : 1, height: '34px', fontSize: v === 'Ajustes' ? '18px' : '12px', fontWeight: '900', borderRadius: '6px', border: 'none', backgroundColor: vista === v ? 'var(--text-primary)' : 'var(--btn-bg)', color: vista === v ? 'var(--bg-card)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {v === 'Ajustes' ? <Settings size={18} /> : v.toUpperCase()}
                </button>
              ))}
            </nav>
          </header>

          <main style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
            
            {vista === 'Ajustes' && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <button onClick={() => setVista('Calendario')} style={{ alignSelf: 'flex-start', border: 'none', background: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', marginBottom: '8px', cursor: 'pointer' }}>
                    <ArrowLeft size={18} /> Volver
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--btn-bg)', padding: '8px 10px', borderRadius: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)' }}>INICIO PATRÓN:</span>
                        <input type="date" value={inicioCicloStr} onChange={e => handleDateChange(e, setInicioCicloStr)} style={{ padding: '4px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                        {cicloPersonalizado.map((v, i) => (
                          <button key={i} onClick={() => { vibrate(); const n = [...cicloPersonalizado]; n[i] = !n[i]; setCicloPersonalizado(n); }} style={{ height: '32px', borderRadius: '6px', background: v ? misColores.con : misColores.sin, border: '1px solid rgba(0,0,0,0.1)', color: getTextoParaFondo(v?misColores.con:misColores.sin), cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ fontSize: '7px', fontWeight: '900' }}>{diasPatron[i % 7]}</span>
                            <LabelEstado tipo={v ? 'con' : 'sin'} scale={0.5} />
                          </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ flex: 1, height: '32px', borderRadius: '8px', position: 'relative', background: misColores.con, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: getTextoParaFondo(misColores.con), pointerEvents: 'none' }}>CON NIÑ@S</span>
                            <input type="color" value={misColores.con} onChange={e => setMisColores({...misColores, con: e.target.value})} style={{ width: '100%', height: '100%', opacity: 0, position: 'absolute' }} />
                        </div>
                        <div style={{ flex: 1, height: '32px', borderRadius: '8px', position: 'relative', background: misColores.sin, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: getTextoParaFondo(misColores.sin), pointerEvents: 'none' }}>SIN NIÑ@S</span>
                            <input type="color" value={misColores.sin} onChange={e => setMisColores({...misColores, sin: e.target.value})} style={{ width: '100%', height: '100%', opacity: 0, position: 'absolute' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-primary)' }}>REGLAS CONVENIO ({anioActual}):</span>
                      <input type="checkbox" checked={aplicarConvenio} onChange={(e) => setAplicarConvenio(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                    </div>

                    {aplicarConvenio && (
                      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <button onClick={() => { vibrate(); setModalConvenio('navidad') }} style={{ padding: '10px', background: 'var(--btn-bg)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: '900', fontSize: '12px' }}>
                            <span>🎄 NAVIDAD</span> <ChevronRight size={16}/>
                        </button>
                        <button onClick={() => { vibrate(); setModalConvenio('ss') }} style={{ padding: '10px', background: 'var(--btn-bg)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: '900', fontSize: '12px' }}>
                            <span>🕊️ SEMANA SANTA</span> <ChevronRight size={16}/>
                        </button>
                        <button onClick={() => { vibrate(); setModalConvenio('verano') }} style={{ padding: '10px', background: 'var(--btn-bg)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: '900', fontSize: '12px' }}>
                            <span>☀️ VERANO</span> <ChevronRight size={16}/>
                        </button>
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '6px', marginBottom: '40px' }}>
                         <button onClick={handleExportarDatos} style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--text-primary)', background: 'white', color: 'var(--text-primary)', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Save size={14}/> EXPORTAR</button>
                         <button onClick={() => fileInputRef.current.click()} style={{ flex: 1, height: '36px', borderRadius: '8px', border: 'none', background: 'var(--text-primary)', color: 'white', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Upload size={14}/> IMPORTAR</button>
                         <input type="file" ref={fileInputRef} onChange={handleImportarDatos} accept=".json" style={{ display: 'none' }} />
                         {!confirmarReset ? (
                            <button onClick={() => { vibrate(); setConfirmarReset(true); }} style={{ height: '36px', width: '36px', background: 'white', border: '1px solid #FF5252', color: '#FF5252', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                         ) : (
                            <button onClick={() => { vibrate(); localStorage.clear(); window.location.reload(); }} style={{ height: '36px', width: '36px', background: '#FF5252', border: 'none', color: 'white', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}>OK</button>
                         )}
                    </div>
                </div>
              </div>
            )}
            
            {vista === 'Calendario' && (
              <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <button onClick={() => { vibrate(); setFechaVisualizacion(new Date(fechaVisualizacion.getFullYear(), fechaVisualizacion.getMonth() - 1, 1)) }} style={{ border: 'none', background: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0 10px' }}><ChevronLeft size={28} /></button>
                  <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(fechaVisualizacion).toUpperCase()}</h2>
                  <button onClick={() => { vibrate(); setFechaVisualizacion(new Date(fechaVisualizacion.getFullYear(), fechaVisualizacion.getMonth() + 1, 1)) }} style={{ border: 'none', background: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0 10px' }}><ChevronRight size={28} /></button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <button onClick={() => { vibrate(); setFechaVisualizacion(new Date()); setFechaBusqueda(''); }} style={{ border: 'none', background: 'none', color: '#76B852', fontSize: '10px', fontWeight: '900', textDecoration: 'underline', cursor: 'pointer' }}>IR A HOY</button>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--btn-bg)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginRight: '5px', fontWeight: '700' }}>IR A:</span>
                    <input type="date" value={fechaBusqueda} onChange={handleIrAFecha} style={{ border: 'none', background: 'transparent', fontSize: '11px', color: 'var(--text-primary)', fontWeight: '700', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', flex: 1, alignContent: 'stretch', gridAutoRows: '1fr', padding: '0 20px', marginBottom: '10px' }}>
                  {diasSemana.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '14px', fontWeight: '900', color: 'var(--text-secondary)', alignSelf: 'center' }}>{d}</div>)}
                  {getCeldas(fechaVisualizacion.getFullYear(), fechaVisualizacion.getMonth()).map((c, i) => {
                    const bg = getEstadoDia(c.f) ? misColores.con : misColores.sin;
                    const esHoy = c.f.toDateString() === hoy.toDateString();
                    const esDelMes = c.m === 0;
                    return (
                      <div key={i} onClick={() => { if(esDelMes){ vibrate(); setDiaSeleccionado(c.f.toDateString()); } }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900', borderRadius: '10px', backgroundColor: bg, color: getTextoParaFondo(bg), border: esHoy ? '3px solid var(--text-primary)' : '1px solid rgba(0,0,0,0.05)', opacity: esDelMes ? 1 : 0.3, position: 'relative', cursor: esDelMes ? 'pointer' : 'default', boxShadow: esDelMes ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                        {c.d}{excepciones[c.f.toDateString()] && <div style={{ position: 'absolute', top: '3px', right: '3px', width: '6px', height: '6px', background: '#FF9800', borderRadius: '50%' }} />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingBottom: '15px', flexShrink: 0 }}>
                  <div style={{ flex: 1, padding: '10px', backgroundColor: misColores.con, borderRadius: '10px', color: getTextoParaFondo(misColores.con), display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="con" scale={1.3} /></div>
                  <div style={{ flex: 1, padding: '10px', backgroundColor: misColores.sin, borderRadius: '10px', color: getTextoParaFondo(misColores.sin), display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="sin" scale={1.3} /></div>
                </div>
              </div>
            )}

            {vista === 'Año' && (
                <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', gap: '20px' }}>
                        <button onClick={() => setFechaVisualizacion(new Date(fechaVisualizacion.getFullYear()-1,0,1))} style={{background: 'var(--btn-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '5px 15px', cursor: 'pointer'}}><ChevronLeft size={20}/></button>
                        <h2 style={{fontSize:'18px', fontWeight:'900', color: 'var(--text-primary)', margin:0}}>{fechaVisualizacion.getFullYear()}</h2>
                        <button onClick={() => setFechaVisualizacion(new Date(fechaVisualizacion.getFullYear()+1,0,1))} style={{background: 'var(--btn-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '5px 15px', cursor: 'pointer'}}><ChevronRight size={20}/></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
                        {Array.from({length:12}).map((_,i) => (
                            <div key={i} onClick={()=>{setVista('Calendario');setFechaVisualizacion(new Date(fechaVisualizacion.getFullYear(),i,1))}} style={{border:'1px solid var(--border-color)', borderRadius:'10px', padding:'5px', background:'var(--bg-card)', cursor:'pointer', display: 'flex', flexDirection: 'column'}}>
                                <p style={{fontSize:'9px', fontWeight:'900', textAlign:'center', margin:'0 0 5px 0', color:'var(--text-primary)'}}>{new Intl.DateTimeFormat('es',{month:'short'}).format(new Date(0,i)).toUpperCase()}</p>
                                <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'1px', flex: 1}}>
                                    {getCeldas(fechaVisualizacion.getFullYear(),i).map((c,j) => {
                                        const bg = getEstadoDia(c.f) ? misColores.con : misColores.sin;
                                        return <div key={j} style={{width: '100%', height: '100%', backgroundColor: bg, opacity: c.m === 0 ? 1 : 0.3, borderRadius: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700', color: getTextoParaFondo(bg)}}>{c.m === 0 ? c.d : ''}</div>
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {vista === 'Vacac.' && (
              <div className="fade-in" style={{ paddingBottom: '40px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>GESTIÓN DE VACACIONES</h2>
                <div style={{ background: 'var(--btn-bg)', padding: '10px', borderRadius: '12px', marginBottom: '10px', border: '1px solid var(--border-color)' }}>
                  <input type="date" value={vacaInicio} onChange={e => handleDateChange(e, setVacaInicio)} style={{ width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                  <input type="date" value={vacaFin} min={vacaInicio} onChange={e => handleDateChange(e, setVacaFin)} style={{ width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <button onClick={() => { vibrate(); setVacaTipo('con') }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: vacaTipo === 'con' ? '2px solid var(--text-primary)' : '2px solid transparent', background: misColores.con, color: getTextoParaFondo(misColores.con), opacity: vacaTipo === 'con' ? 1 : 0.6, cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="con" /></button>
                    <button onClick={() => { vibrate(); setVacaTipo('sin') }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: vacaTipo === 'sin' ? '2px solid var(--text-primary)' : '2px solid transparent', background: misColores.sin, color: getTextoParaFondo(misColores.sin), opacity: vacaTipo === 'sin' ? 1 : 0.6, cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="sin" /></button>
                  </div>
                  <button onClick={() => { vibrate(); setVacaciones([...vacaciones, { inicio: vacaInicio, fin: vacaFin, tipo: vacaTipo }]) }} style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-card)', borderRadius: '8px', border: 'none', fontWeight: '900', fontSize: '14px' }}>AÑADIR PERIODO</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {vacaciones.map((v, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', marginBottom: '6px', borderLeft: `5px solid ${v.tipo==='con'?misColores.con:misColores.sin}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{new Date(v.inicio).toLocaleDateString('es-ES')} - {new Date(v.fin).toLocaleDateString('es-ES')}</span>
                        <button onClick={() => { vibrate(); setVacaciones(vacaciones.filter((_, idx) => idx !== i)) }} style={{ border: 'none', background: 'none', color: '#FF5252', fontWeight: '900', fontSize: '16px', padding: '0 8px' }}><Trash2 size={20} /></button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {vista === 'Excep.' && (
              <div className="fade-in" style={{ paddingBottom: '40px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>NOTAS Y EXCEPCIONES</h2>
                <div style={{ background: 'var(--btn-bg)', padding: '10px', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', marginBottom: '5px' }}>AÑADIR MANUALMENTE</p>
                  <input type="date" value={excepFecha} onChange={e => handleDateChange(e, setExcepFecha)} style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                  <textarea value={excepNota} onChange={e => setExcepNota(e.target.value)} placeholder="Nota (opcional)..." style={{ width: '100%', height: '60px', padding: '10px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'none', boxSizing: 'border-box', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => addExcepcionManual('con')} style={{ flex: 1, padding: '10px', background: misColores.con, color: getTextoParaFondo(misColores.con), borderRadius: '8px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="con" /></button>
                      <button onClick={() => addExcepcionManual('sin')} style={{ flex: 1, padding: '10px', background: misColores.sin, color: getTextoParaFondo(misColores.sin), borderRadius: '8px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><LabelEstado tipo="sin" /></button>
                  </div>
                </div>
                {Object.keys(excepciones).sort((a, b) => new Date(b) - new Date(a)).map(id => (
                  <div key={id} style={{ padding: '10px', background: 'var(--bg-card)', borderRadius: '10px', marginBottom: '6px', border: '1px solid var(--border-color)', borderLeft: `5px solid ${excepciones[id].estado==='con'?misColores.con:misColores.sin}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: '900', fontSize: '11px', color: 'var(--text-primary)' }}>{new Date(id).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</span>
                      <button onClick={() => { vibrate(); const n = { ...excepciones }; delete n[id]; setExcepciones(n); }} style={{ border: 'none', background: 'none', color: '#FF5252', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ background: 'var(--btn-bg)', padding: '4px 10px', borderRadius: '6px' }}><LabelEstado tipo={excepciones[id].estado} scale={0.9} colorOverride={excepciones[id].estado === 'con' ? misColores.con : misColores.sin} /></div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic' }}>{excepciones[id].nota}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {diaSeleccionado && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 style={{ textAlign: 'center', color: 'var(--text-primary)', margin: '0 0 15px 0', fontSize: '18px', fontWeight: '900' }}>{new Date(diaSeleccionado).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => { setExcepciones({...excepciones, [diaSeleccionado]: { nota: textoExcepcion, estado: 'con' }}); setDiaSeleccionado(null); }} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', background: misColores.con, fontWeight: '900', color: '#FFF' }}><LabelEstado tipo="con" scale={1.2}/></button>
                  <button onClick={() => { setExcepciones({...excepciones, [diaSeleccionado]: { nota: textoExcepcion, estado: 'sin' }}); setDiaSeleccionado(null); }} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', background: misColores.sin, fontWeight: '900', color: '#FFF' }}><LabelEstado tipo="sin" scale={1.2}/></button>
                </div>
                <textarea value={textoExcepcion} onChange={e => setTextoExcepcion(e.target.value)} placeholder="Nota..." style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '15px', resize: 'none' }} />
                <button onClick={() => setDiaSeleccionado(null)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--bg-app)', color: 'var(--text-primary)', fontWeight: '900' }}>CERRAR</button>
              </div>
            </div>
          )}

          {modalConvenio && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                        {modalConvenio === 'navidad' && '🎄 NAVIDAD'}
                        {modalConvenio === 'ss' && '🕊️ SEMANA SANTA'}
                        {modalConvenio === 'verano' && '☀️ VERANO'}
                    </h3>
                    <button onClick={() => setModalConvenio(null)} style={{ border: 'none', background: 'none' }}><X size={24} color="var(--text-primary)" /></button>
                </div>

                {modalConvenio === 'verano' ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {['julio', 'agosto'].map(m => (
                            <div key={m} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-secondary)' }}>{m.toUpperCase()} (1ª QUINCENA):</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setConvenio({...convenio, [m+'_par']: 'con'})} style={estiloBtnConvenio(convenio[m+'_par']==='con','con')}>CON NIÑ@S</button>
                                    <button onClick={() => setConvenio({...convenio, [m+'_par']: 'sin'})} style={estiloBtnConvenio(convenio[m+'_par']==='sin','sin')}>SIN NIÑ@S</button>
                                </div>
                            </div>
                        ))}
                   </div>
                ) : (
                   <>
                       <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>INICIO</label>
                                <input type="date" value={modalConvenio==='navidad'?convenio.navidad_inicio:convenio.ss_inicio} onChange={e => handleDateChange(e, v => setConvenio({...convenio, [modalConvenio+'_inicio']: v}))} style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>FIN</label>
                                <input type="date" value={modalConvenio==='navidad'?convenio.navidad_fin:convenio.ss_fin} min={modalConvenio==='navidad'?convenio.navidad_inicio:convenio.ss_inicio} onChange={e => handleDateChange(e, v => setConvenio({...convenio, [modalConvenio+'_fin']: v}))} style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                            </div>
                       </div>
                       
                       <div style={{ padding: '15px', background: 'var(--btn-bg)', borderRadius: '12px' }}>
                           <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', marginBottom: '10px', textAlign: 'center' }}>TOCA LOS DÍAS PARA CAMBIAR EL TURNO:</p>
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                {getDiasRango(modalConvenio==='navidad'?convenio.navidad_inicio:convenio.ss_inicio, modalConvenio==='navidad'?convenio.navidad_fin:convenio.ss_fin).map((d, idx) => {
                                    const iso = d.toISOString().split('T')[0];
                                    const estado = (modalConvenio==='navidad'?convenio.navidad_detalle:convenio.ss_detalle)?.[iso] || 'con';
                                    return <button key={idx} onClick={() => modalConvenio==='navidad'?toggleDiaNavidad(iso):toggleDiaSS(iso)} style={{ aspectRatio: '1', borderRadius: '6px', background: estado === 'con' ? misColores.con : misColores.sin, border: 'none', color: getTextoParaFondo(estado==='con'?misColores.con:misColores.sin), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '900' }}>{d.getDate()}</span>
                                        <span style={{ fontSize: '8px', fontWeight: '900', opacity: 0.9 }}>{estado === 'con' ? 'CON' : 'SIN'}</span>
                                    </button>
                                })}
                           </div>
                       </div>
                   </>
                )}
                
                <button onClick={() => setModalConvenio(null)} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--text-primary)', color: 'white', fontWeight: '900', fontSize: '14px' }}>GUARDAR Y CERRAR</button>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default App;