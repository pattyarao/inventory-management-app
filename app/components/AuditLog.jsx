import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Fetch audit log data from Supabase
    const fetchAuditLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('auth.audit_log_entries')
          .select('*');

        if (error) {
          throw error;
        }

        setAuditLogs(data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchAuditLogs();
  }, []);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 rounded-md">
      <div className="w-full flex flex-col gap-2">
        <h1 className="w-full rounded-t-md text-lg font-black">Audit Log View</h1>
        <div className="w-full h-full flex justify-center gap-6">
        </div>
      </div>

      <div className="w-full h-full">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Activity</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{log.timestamp}</td>
                <td className="py-2 px-4 border-b">{log.user}</td>
                <td className="py-2 px-4 border-b">{log.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;