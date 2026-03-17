import React from "react";
import "../styles/MeetLeadership.css";

import alexJ from "../assets/alexj.jpg";
import avatar4 from "../assets/avatar4.jpg";
import avatar5 from "../assets/avatar5.jpg";
import avatar6 from "../assets/avatar6.jpg";

function MeetLeadership() {

  const leaders = [
    {
      name: "Alex Rivers",
      role: "CEO & Co-Founder",
      image: alexJ
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      image: avatar4
    },
    {
      name: "Marcus Thorne",
      role: "Head of Design",
      image: avatar5
    },
    {
      name: "Elena Rodriguez",
      role: "VP of Product",
      image: avatar6
    }
  ];

  return (
    <section className="leadership-section">

      <div className="leadership-container">

        <h2 className="leadership-title">
          Meet the Leadership
        </h2>

        <p className="leadership-subtitle">
          The visionary team leading the future of interior visualization.
        </p>

        <div className="leaders-grid">

          {leaders.map((leader, index) => (
            <div className="leader-card" key={index}>

              <div className="avatar">
                <img src={leader.image} alt={leader.name} />
              </div>

              <h4>{leader.name}</h4>

              <p className="leader-role">
                {leader.role}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default MeetLeadership;