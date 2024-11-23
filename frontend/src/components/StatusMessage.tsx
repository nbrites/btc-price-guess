import React, { useState, useEffect } from 'react';
import 'animate.css';
import './StatusMessage.css';

interface StatusMessageProps {
  status: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  const [prevStatus, setPrevStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status !== prevStatus) {
      setPrevStatus(status);
    }
  }, [status, prevStatus]);

  const displayStatus = status || "No status available";

  return (
    <div className="status-message-container">
      <div
        key={displayStatus}
        className={`status-message animate__animated animate__pulse`}
      >
        <div>{displayStatus}</div>
      </div>
    </div>
  );
};

export default StatusMessage;
