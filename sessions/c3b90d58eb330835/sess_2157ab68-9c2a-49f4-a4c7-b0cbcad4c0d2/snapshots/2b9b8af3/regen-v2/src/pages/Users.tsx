import { MOCK_USERS } from '../data/users';
import { ROLE_LABELS } from '../utils/permissions';

export function UsersPage() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="text-sm font-mono font-semibold text-text-primary mb-4">
        User Management
      </h1>
      <div className="panel overflow-hidden">
        <table className="w-full text-xs font-mono" aria-label="Users">
          <thead>
            <tr className="border-b border-border">
              {['User', 'Email', 'Role', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-text-dim uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_USERS.map(u => (
              <tr key={u.id} className="hover:bg-surface2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-cyan/15 border border-cyan/25 flex items-center justify-center text-cyan font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-text-primary font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded border border-cyan/25 text-cyan">
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-green" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
