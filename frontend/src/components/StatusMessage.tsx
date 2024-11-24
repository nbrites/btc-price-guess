import React, { useState, useEffect } from 'react';
import 'animate.css';
import './StatusMessage.css'; // Import the existing CSS

interface StatusMessageProps {
  status: string | null;
  remainingTime: number;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, remainingTime }) => {
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
        className="status-message animate__animated animate__pulse"
      >
        <div className="flex justify-center w-full relative">
          <div className="text-center w-full">{displayStatus}</div>
          <div className="absolute right-0 flex items-center justify-end pr-4">
            <span>⏳ {remainingTime}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusMessage;
