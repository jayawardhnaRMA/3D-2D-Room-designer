import React from "react";
import "../styles/Stats.css";

function Stats() {
return ( <section className="stats">

  <div className="stats-container">

    <div className="stat-item">
      <h3>50k+</h3>
      <p>Active Users</p>
    </div>

    <div className="stat-item">
      <h3>10,000+</h3>
      <p>Furniture Items</p>
    </div>

    <div className="stat-item">
      <h3>1M+</h3>
      <p>Renderings Created</p>
    </div>

    <div className="stat-item">
      <h3>4.9/5</h3>
      <p>User Rating</p>
    </div>

  </div>

</section>


);
}

export default Stats;
