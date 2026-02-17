import React, { useState } from 'react'; const VERSION_LOCAL = "1.0.0";
import { 
  Settings, ChevronLeft, ChevronRight, 
  Bell, Calendar, X, Plus, Check, ArrowRight, 
  LayoutGrid, Users, Heart, Shield, Share2, Key, DoorOpen,
  Clock, CalendarDays, Repeat, Sun, Moon, Coffee
} from 'lucide-react';

const App = () => {
  // --- SISTEMA DE ACTUALIZACIÓN ---
  const [hayNuevaVersion, setHayNuevaVersion] = useState(false);

  useEffect(() => {
    const comprobarActualizacion = async () => {
      try {
        // En esta fase de prueba, leemos el archivo local que creaste
const respuesta = await fetch('https://raw.githubusercontent.com/JavierVenero/custodiapp-hij-s/refs/heads/main/src/version.json');        
        if (datos.version !== VERSION_LOCAL) {
          setHayNuevaVersion(true);
        }
      } catch (error) {
        console.log("Error al comprobar versión");
      }
    };
    comprobarActualizacion();
  }, []);
  // --- ESTADOS DE CONFIGURACIÓN Y ACCESO ---
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');
  const [centroId, setCentroId] = useState('');
  const [modoAcceso, setModoAcceso] = useState(null); 
  const [tempCodigo, setTempCodigo] = useState('');
  const [isCargando, setIsCargando] = useState(false);

  // --- ESTADOS DE CONFIGURACIÓN DE TURNOS Y PATRONES ---
  const [configuracionVista, setConfiguracionVista] = useState('calendario'); // 'calendario' o 'config-patron'
  const [turnosActivos, setTurnosActivos] = useState([
    { id: 'mñn', nombre: 'Mañana', icon: <Coffee size={18} />, activo: true, hora: '08:00 - 15:00' },
    { id: 'tarde', nombre: 'Tarde', icon: <Sun size={18} />, activo: true, hora: '15:00 - 22:00' },
    { id: 'noche', nombre: 'Noche', icon: <Moon size={18} />, activo: false, hora: '22:00 - 08:00' }
  ]);

  const [patronesMensuales, setPatronesMensuales] = useState([]);
  
  // --- PALETA DE COLORES EXCLUSIVOS (Mesa Redonda / Centro de Cuidado) ---
  const coloresPaleta = [
    '#76B852', '#2D408F', '#FF9800', '#E91E63', 
    '#9C27B0', '#00BCD4', '#FF5252', '#607D8B'
  ];

  const [coloresOcupados] = useState(['#E91E63']); // Simulación de ocupación en el Centro

  // --- COMPONENTES DE DISEÑO PREMIUM ---
  const LogoMarca = ({ size = '240px' }) => (
    <div style={{ 
      width: size, height: size, margin: '0 auto', 
      borderRadius: '55px', overflow: 'hidden', 
      boxShadow: '0 25px 50px rgba(45,64,143,0.15)', 
      backgroundColor: '#FFF', border: '1px solid #F0F2F5',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <img 
        src="/logo-care.png" 
        alt="CustodiApp" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        onError={(e) => { e.target.src = "https://via.placeholder.com/240?text=CustodiApp"; }}
      />
    </div>
  );

  const BotonPrincipal = ({ label, onClick, disabled, icon: Icon, color = '#2D408F' }) => (
    <button 
      disabled={disabled} 
      onClick={onClick}
      style={{ 
        width: '100%', padding: '22px', 
        background: disabled ? '#E2E8F0' : color, 
        color: 'white', border: 'none', borderRadius: '20px', 
        fontWeight: '900', fontSize: '17px', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        gap: '12px', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: disabled ? 'none' : `0 10px 20px ${color}33`
      }}
    >
      {label.toUpperCase()} {Icon && <Icon size={22} />}
    </button>
  );

  const finalizarConfiguracion = (id) => {
    setIsCargando(true);
    setTimeout(() => {
      setCentroId(id);
      setPaso(4); // Salto directo a la gestión de periodos y calendario
      setIsCargando(false);
    }, 1000);
  };

  // --- PANTALLA 1: IDENTIDAD ---
  if (paso === 1) {
    return (
      <div style={{ padding: '60px 30px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: '-apple-system, system-ui, sans-serif' }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          .brand-fade { animation: fadeIn 0.6s ease-out; }
        `}</style>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="brand-fade">
          <LogoMarca />
          <h1 style={{ color: '#2D408F', fontSize: '38px', fontWeight: '900', marginTop: '30px', marginBottom: '5px', letterSpacing: '-2px' }}>CustodiApp</h1>
          <p style={{ color: '#76B852', fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '2px' }}>CUIDADOS</p>
        </div>
        {/* --- BANNER DE ACTUALIZACIÓN --- */}
      {hayNuevaVersion && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: '#2D408F',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Nueva versión disponible</div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: '#76B852', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ACTUALIZAR
          </button>
        </div>
      )}

        <div style={{ flex: 1, marginTop: '20px' }} className="brand-fade">
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#2D408F', marginBottom: '8px' }}>Bienvenido</h2>
          <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: '30px', fontWeight: '500' }}>Dinos cómo te llamas y cómo quieres que te vean en el centro.</p>
          
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre (ej: Javier)"
            style={{ 
              width: '100%', padding: '22px', borderRadius: '20px', border: '3px solid #F1F5F9', 
              fontSize: '18px', fontWeight: '700', marginBottom: '30px', boxSizing: 'border-box', outline: 'none',
              color: '#2D408F', transition: 'all 0.3s', backgroundColor: '#F8FAFC'
            }}
          />
        </div>

        <BotonPrincipal label="Siguiente Paso" onClick={() => setPaso(2)} disabled={!nombre || nombre.length < 2} icon={ArrowRight} />
      </div>
    );
  }

  // --- PANTALLA 2: SELECCIÓN DE COLOR ---
  if (paso === 2) {
    return (
      <div style={{ padding: '60px 30px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: '-apple-system, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#2D408F', margin: 0 }}>HOLA, {nombre.toUpperCase()}</h2>
          <p style={{ color: '#94A3B8', fontSize: '16px', marginTop: '10px', fontWeight: '500' }}>Elige tu color único para este Centro de Cuidado.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px', flex: 1, alignContent: 'start' }}>
          {coloresPaleta.map(c => {
            const ocupado = coloresOcupados.includes(c);
            const esSeleccionado = color === c;
            return (
              <div 
                key={c} 
                onClick={() => !ocupado && setColor(c)} 
                style={{ 
                  backgroundColor: c, aspectRatio: '1', borderRadius: '22px', 
                  border: esSeleccionado ? '6px solid #2D408F' : '6px solid transparent', 
                  cursor: ocupado ? 'not-allowed' : 'pointer', 
                  opacity: ocupado ? 0.3 : 1, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: esSeleccionado ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {ocupado && <X size={24} color="white" />}
                {esSeleccionado && <Check size={28} color="white" strokeWidth={4} />}
              </div>
            );
          })}
        </div>

        <BotonPrincipal label="Confirmar Perfil" onClick={() => setPaso(3)} disabled={!color} />
      </div>
    );
  }

  // --- PANTALLA 3: CREACIÓN DE LA LLAVE ---
  if (paso === 3) {
    return (
      <div style={{ padding: '60px 30px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', boxSizing: 'border-box', fontFamily: '-apple-system, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <LogoMarca size="150px" />
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#2D408F', marginTop: '20px' }}>CENTRO DE CUIDADO</h2>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>{modoAcceso === 'crear' ? 'Invéntate la llave de acceso' : 'Introduce la llave del centro'}</p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!modoAcceso ? (
            <>
              <BotonPrincipal label="Crear Nuevo Centro" color="#76B852" icon={Plus} onClick={() => setModoAcceso('crear')} />
              <div style={{ textAlign: 'center', color: '#CBD5E1', fontWeight: '900', fontSize: '12px' }}>— O ÚNETE A UNO —</div>
              <BotonPrincipal label="Unirme a un Centro" icon={DoorOpen} onClick={() => setModoAcceso('unirse')} />
            </>
          ) : (
            <div className="brand-fade">
              <input 
                type="text" 
                placeholder={modoAcceso === 'crear' ? "INVENTA TU LLAVE" : "INTRODUCE LLAVE"} 
                value={tempCodigo}
                onChange={(e) => setTempCodigo(e.target.value.toUpperCase())}
                style={{ 
                  width: '100%', padding: '22px', borderRadius: '25px', border: '3px solid #F1F5F9', 
                  fontSize: '22px', fontWeight: '900', textAlign: 'center', boxSizing: 'border-box',
                  color: '#2D408F', backgroundColor: '#F8FAFC', outline: 'none', marginBottom: '20px'
                }}
              />
              <BotonPrincipal 
                label={modoAcceso === 'crear' ? "Establecer Llave" : "Acceder al Centro"} 
                disabled={tempCodigo.length < 4}
                onClick={() => finalizarConfiguracion(tempCodigo)}
                icon={Key}
              />
              <button onClick={() => {setModoAcceso(null); setTempCodigo('');}} style={{ width: '100%', background: 'none', border: 'none', color: '#94A3B8', marginTop: '20px', fontWeight: '700', cursor: 'pointer' }}>VOLVER ATRÁS</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- PANTALLA 4: CENTRO DE CUIDADO (CALENDARIO Y TURNOS) ---
  if (paso === 4) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', fontFamily: '-apple-system, system-ui, sans-serif' }}>
        {/* Header con Info del Centro */}
        <div style={{ padding: '30px 25px 20px', backgroundColor: 'white', borderRadius: '0 0 35px 35px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ margin: 0, color: '#76B852', fontWeight: '800', fontSize: '11px', letterSpacing: '1.5px' }}>LLAVE: {centroId}</p>
              <h1 style={{ margin: 0, color: '#2D408F', fontSize: '24px', fontWeight: '900' }}>Zona de Cuidado</h1>
            </div>
            <div style={{ width: '45px', height: '45px', backgroundColor: color, borderRadius: '15px', border: '3px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
          </div>

          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '15px', padding: '5px' }}>
            <button 
              onClick={() => setConfiguracionVista('calendario')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', backgroundColor: configuracionVista === 'calendario' ? 'white' : 'transparent', color: '#2D408F', transition: 'all 0.3s' }}
            >
              CALENDARIO
            </button>
            <button 
              onClick={() => setConfiguracionVista('config-patron')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', backgroundColor: configuracionVista === 'config-patron' ? 'white' : 'transparent', color: '#2D408F', transition: 'all 0.3s' }}
            >
              TURNOS Y PATRÓN
            </button>
          </div>
        </div>

        {/* Zona de Trabajo */}
        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {configuracionVista === 'calendario' ? (
            <div className="brand-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#2D408F', fontWeight: '900', fontSize: '18px' }}>Febrero 2026</h3>
                <CalendarDays color="#2D408F" />
              </div>
              
              {/* Grid Simplificado de Calendario Mensual */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '900', color: '#CBD5E1' }}>{d}</div>
                ))}
                {[...Array(28)].map((_, i) => (
                  <div key={i} style={{ 
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    borderRadius: '12px', fontSize: '14px', fontWeight: '700', color: (i+1 === 14) ? 'white' : '#2D408F',
                    backgroundColor: (i+1 === 14) ? '#2D408F' : 'transparent'
                  }}>
                    {i + 1}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '25px', backgroundColor: '#EEF2FF', padding: '20px', borderRadius: '25px', border: '2px dashed #D1D5DB' }}>
                <p style={{ margin: 0, textAlign: 'center', color: '#4A5CB3', fontWeight: '700', fontSize: '14px' }}>
                  No hay turnos asignados para hoy.<br/>Configura tu patrón mensual.
                </p>
              </div>
            </div>
          ) : (
            <div className="brand-fade">
              <h3 style={{ margin: '0 0 20px 0', color: '#2D408F', fontWeight: '900', fontSize: '18px' }}>Configuración de Turnos</h3>
              
              {turnosActivos.map(turno => (
                <div key={turno.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '25px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '15px', color: '#2D408F' }}>
                      {turno.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#2D408F', fontWeight: '800' }}>{turno.nombre}</h4>
                      <p style={{ margin: 0, color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>{turno.hora}</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setTurnosActivos(turnosActivos.map(t => t.id === turno.id ? {...t, activo: !t.activo} : t))}
                    style={{ width: '50px', height: '28px', backgroundColor: turno.activo ? '#76B852' : '#E2E8F0', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                  >
                    <div style={{ width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: turno.activo ? '25px' : '3px', transition: 'all 0.3s' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2D408F', fontWeight: '900', fontSize: '18px' }}>Patrón de Repetición</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '2px solid #F1F5F9', background: 'white', color: '#2D408F', fontWeight: '800', fontSize: '12px' }}>7 DÍAS</button>
                  <button style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '2px solid #2D408F', background: 'white', color: '#2D408F', fontWeight: '800', fontSize: '12px' }}>14 DÍAS</button>
                  <button style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '2px solid #F1F5F9', background: 'white', color: '#2D408F', fontWeight: '800', fontSize: '12px' }}>MES COMPLETO</button>
                </div>
                <BotonPrincipal label="Guardar Patrón Mensual" icon={Repeat} />
              </div>
            </div>
          )}
        </div>

        {/* Tab Bar Inferior */}
        <div style={{ height: '90px', backgroundColor: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '20px' }}>
          <LayoutGrid size={26} color={configuracionVista === 'calendario' ? "#2D408F" : "#CBD5E1"} />
          <Calendar size={26} color="#CBD5E1" />
          <div style={{ 
            width: '60px', height: '60px', backgroundColor: '#76B852', borderRadius: '20px', 
            marginTop: '-40px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 10px 20px rgba(118,184,82,0.3)', border: '5px solid #F8FAFC' 
          }}>
            <Plus color="white" size={32} strokeWidth={3} />
          </div>
          <Bell size={26} color="#CBD5E1" />
          <Settings size={26} color={configuracionVista === 'config-patron' ? "#2D408F" : "#CBD5E1"} />
        </div>
      </div>
    );
  }

  return null;
};

export default App;