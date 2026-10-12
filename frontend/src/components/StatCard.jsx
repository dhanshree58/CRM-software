import React from "react";
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  type = "blue"
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>

        <Icon size={21} />

      </div>

      <div className="stat-content">

        <span>
          {title}
        </span>

        <h2>
          {value}
        </h2>

        <small
          className={
            change?.startsWith("-")
              ? "negative"
              : "positive"
          }
        >
          {change}
        </small>

      </div>

    </div>
  );
}

export default StatCard;
