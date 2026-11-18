import Link from "next/link";

import { features, plans, stats, testimonials } from "./data";

export default function Exp2Page() {
  return (
    <div className="exp2">
      {/* ============ Navbar ============ */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            ◆ Nebula
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#exp2nav"
            aria-controls="exp2nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="exp2nav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#pricing">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#stories">
                  Customers
                </a>
              </li>
              <li className="nav-item ms-lg-3">
                <a className="btn btn-primary" href="#cta">
                  Get started
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ============ Hero ============ */}
      <header className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-light mb-3">
                ✨ New — AI anomaly detection
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Analytics that answer before you ask.
              </h1>
              <p className="lead mb-4">
                Nebula turns raw product events into live, trustworthy
                dashboards — with AI watching every metric so your team can
                focus on shipping instead of guessing.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#cta" className="btn btn-light btn-lg px-4">
                  Start free
                </a>
                <a
                  href="#features"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  See how it works
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-visual">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-white-50">live · revenue/hr</span>
                  <span className="badge text-bg-success">+18.4%</span>
                </div>
                <div className="bar w-100" />
                <div className="bar w-75" />
                <div className="bar w-50 mb-0" />
                <div className="row text-center mt-4 pt-3 border-top border-light border-opacity-25">
                  <div className="col-4">
                    <div className="fw-bold">4.2M</div>
                    <small className="text-white-50">events</small>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold">312ms</div>
                    <small className="text-white-50">p95</small>
                  </div>
                  <div className="col-4">
                    <div className="fw-bold">99.98%</div>
                    <small className="text-white-50">uptime</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ Stats strip ============ */}
      <section className="stats py-4">
        <div className="container">
          <div className="row row-cols-2 row-cols-lg-4 g-3 text-center">
            {stats.map((stat) => (
              <div className="col" key={stat.label}>
                <div className="num">{stat.value}</div>
                <small className="text-white-50">{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section id="features" className="section">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="text-primary fw-semibold small text-uppercase">
                Features
              </span>
              <h2 className="fw-bold mt-2">
                Everything you need to trust your numbers
              </h2>
              <p className="text-secondary">
                From event ingestion to AI-powered alerts — one platform, zero
                glue code.
              </p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {features.map((feature) => (
              <div className="col" key={feature.title}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <span className="icon-chip" aria-hidden="true">
                      {feature.icon}
                    </span>
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-secondary mb-0">
                      {feature.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Pricing ============ */}
      <section
        id="pricing"
        className="section pricing bg-light border-top border-bottom"
      >
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="text-primary fw-semibold small text-uppercase">
                Pricing
              </span>
              <h2 className="fw-bold mt-2">Simple plans that scale with you</h2>
              <p className="text-secondary">
                Start free. Upgrade when your data does.
              </p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4 align-items-stretch">
            {plans.map((plan) => (
              <div className="col" key={plan.name}>
                <div
                  className={`card h-100 text-center p-4 ${
                    plan.featured ? "featured" : ""
                  }`}
                >
                  {plan.featured && (
                    <span className="badge text-bg-primary mb-3 mx-auto">
                      Most popular
                    </span>
                  )}
                  <h5 className="fw-bold">{plan.name}</h5>
                  <p className="text-secondary small mb-3">{plan.blurb}</p>
                  <div className="price mb-3">
                    {plan.price}
                    <small>{plan.period}</small>
                  </div>
                  <ul className="list-unstyled text-start mx-auto mb-4 flex-grow-1">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="mb-2">
                        <span className="text-primary me-2">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#cta"
                    className={`btn ${
                      plan.featured ? "btn-primary" : "btn-outline-primary"
                    } w-100`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Testimonial carousel ============ */}
      <section id="stories" className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <span className="text-primary fw-semibold small text-uppercase">
                  Customers
                </span>
                <h2 className="fw-bold mt-2">Loved by data teams</h2>
              </div>
              <div
                id="exp2carousel"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      data-bs-target="#exp2carousel"
                      data-bs-slide-to={i}
                      className={i === 0 ? "active" : ""}
                      aria-current={i === 0 ? "true" : undefined}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="carousel-inner">
                  {testimonials.map((item, i) => (
                    <div
                      key={item.name}
                      className={`carousel-item ${i === 0 ? "active" : ""}`}
                    >
                      <div className="card border-0 shadow-sm text-center p-4">
                        <div className="card-body">
                          <p className="fs-5 mb-4">“{item.quote}”</p>
                          <h6 className="fw-bold mb-0">{item.name}</h6>
                          <small className="text-secondary">{item.role}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#exp2carousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#exp2carousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section id="cta" className="section pt-0">
        <div className="container">
          <div className="cta-band text-center">
            <h2 className="fw-bold">Ready to see your data clearly?</h2>
            <p className="mb-4 opacity-75">
              Free forever for small teams. No credit card required.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a href="#" className="btn btn-light btn-lg px-4">
                Create workspace
              </a>
              <a href="#" className="btn btn-outline-light btn-lg px-4">
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="bg-dark text-white-50 py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center gy-2">
            <div className="col-md-4 text-center text-md-start">
              <span className="text-white fw-bold">◆ Nebula</span> — exp2 ·
              Bootstrap landing
            </div>
            <div className="col-md-4 text-center">
              <small>
                Built with Bootstrap 5 + AI-assisted UI design ·{" "}
                <Link href="/">All experiments</Link>
              </small>
            </div>
            <div className="col-md-4 text-center text-md-end">
              <small>
                <a href="#features">Features</a> ·{" "}
                <a href="#pricing">Pricing</a> ·{" "}
                <a href="#cta">Get started</a>
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


