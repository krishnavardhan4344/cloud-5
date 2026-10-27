export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2>About Grand Stay Hotel</h2>
      <p className="text-muted">A modern hotel focused on comfortable stays and quick service.</p>
      <div className="hotel-card p-4 mb-3">
        <p>
          Grand Stay Hotel offers 120 rooms, a restaurant, a rooftop lounge and 24-hour guest support.
          Our Guest Service Management Platform lets you request anything you need during your stay
          without calling the front desk.
        </p>
        <p className="mb-0">
          Every request goes straight to our team. An administrator assigns it to a staff member,
          and you can follow its progress until it is completed.
        </p>
      </div>
      <div className="row g-3">
        <div className="col-md-4"><div className="hotel-card p-3 text-center"><h4>120</h4><div className="text-muted">Rooms</div></div></div>
        <div className="col-md-4"><div className="hotel-card p-3 text-center"><h4>24/7</h4><div className="text-muted">Guest support</div></div></div>
        <div className="col-md-4"><div className="hotel-card p-3 text-center"><h4>4.8 ★</h4><div className="text-muted">Guest rating</div></div></div>
      </div>
    </div>
  );
}
