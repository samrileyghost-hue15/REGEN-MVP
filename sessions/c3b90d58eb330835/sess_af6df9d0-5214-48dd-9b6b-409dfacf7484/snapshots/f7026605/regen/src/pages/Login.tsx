import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'maintenance_engineer', label: 'Maintenance Engineer', description: 'Detect → Inspect → Repair' },
  { value: 'operations_manager', label: 'Operations Manager', description: 'Monitor → Prioritise → Coordinate' },
  { value: 'administrator', label: 'Administrator', description: 'Monitor System → Manage Users → Configure' },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('maintenance_engineer');

  const handleEnter = () => {
    login(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#00FFC6 1px, transparent 1px), linear-gradient(90deg, #00FFC6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />
      {/* Glow orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,198,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-5xl font-bold tracking-[0.3em] mb-2"
            style={{ color: '#00FFC6', textShadow: '0 0 30px rgba(0,255,198,0.4)' }}
          >
            REGEN
          </h1>
          <p className="text-sm tracking-widest uppercase text-text-secondary">
            Railway Infrastructure Monitoring
          </p>
          <div className="mt-4 h-px w-24 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #00FFC6, transparent)' }} />
        </div>

        {/* Card */}
        <div
          className="rounded border p-8"
          style={{
            background: 'rgba(17,17,17,0.95)',
            borderColor: 'rgba(0,255,198,0.2)',
            boxShadow: '0 0 40px rgba(0,255,198,0.08), inset 0 1px 0 rgba(0,255,198,0.05)',
          }}
        >
          <p className="text-xs text-text-secondary mb-5 tracking-widest uppercase">Select your role</p>

          <div className="space-y-2 mb-6">
            {ROLES.map(role => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className="w-full text-left px-4 py-3 rounded border transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                style={selectedRole === role.value
                  ? { borderColor: 'rgba(0,255,198,0.6)', background: 'rgba(0,255,198,0.06)' }
                  : { borderColor: '#2A2A2A', background: '#1A1A1A' }
                }
                aria-pressed={selectedRole === role.value}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: selectedRole === role.value ? '#00FFC6' : '#F0F0F0' }} className="text-sm font-semibold">
                      {role.label}
                    </p>
                    <p className="text-xs text-text-dim mt-0.5">{role.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${selectedRole === role.value ? 'border-cyan bg-cyan' : 'border-border'}`} />
                </div>
              </button>
            ))}
          </div>

          <button onClick={handleEnter} className="btn-primary w-full justify-center py-3 text-sm tracking-widest">
            ENTER REGEN
          </button>
          <p className="text-center text-[10px] text-text-dim mt-4 tracking-wide">
            MVP PROTOTYPE · SIMULATED DATA · NOT FOR OPERATIONAL USE
          </p>
        </div>
      </div>
    </div>
  );
}
