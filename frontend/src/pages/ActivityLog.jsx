import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectActivity } from "../api/activityApi";
import "./ActivityLog.css";

const ActivityLog = () => {
  const { projectId } = useParams();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, [projectId]);

  const fetchActivity = async () => {
    try {
      const res = await getProjectActivity(projectId);
      setLogs(res.data.logs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="activity-container">

      <h1 className="activity-heading">
        Activity Log
      </h1>

      {logs.length === 0 ? (

        <div className="no-activity">
          No Activity Found
        </div>

      ) : (

        <div>

          {logs.map((log) => (

            <div
              key={log._id}
              className="activity-card"
            >

              <h3 className="activity-action">
                {log.action}
              </h3>

              <p className="activity-details">
                {log.details}
              </p>

              {log.task && (
                <p className="activity-task">
                  <strong>Task:</strong> {log.task.title}
                </p>
              )}

              <p className="activity-user">
                <strong>By:</strong> {log.user?.name}
              </p>

              <p className="activity-date">
                {new Date(log.createdAt).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default ActivityLog;