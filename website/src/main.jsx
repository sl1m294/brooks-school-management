import React from "react";
import ReactDOM from "react-dom/client";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound
} from "lucide-react";
import "./styles.css";

const recognition = ["CBC Ready", "Parent Partnership", "Values Led", "Safe Campus"];

const stats = [
  ["18+", "Learning clubs"],
  ["24", "Learners per stream target"],
  ["4", "Core value pillars"]
];

const approach = [
  {
    title: "Discover",
    tag: "Foundation",
    progress: "30%",
    text: "We learn each child's strengths, home context, language confidence, and classroom needs before setting academic goals."
  },
  {
    title: "Guide",
    tag: "Daily Practice",
    progress: "70%",
    text: "Teachers combine clear lessons, reading routines, numeracy practice, creative projects, and close feedback for steady growth."
  },
  {
    title: "Celebrate",
    tag: "Parent Loop",
    progress: "100%",
    text: "Parents receive simple updates, exam results, attendance insights, and next steps they can understand without education jargon."
  }
];

const programs = [
  {
    title: "Lower Primary",
    meta: "PP1 to Class 3",
    text: "Reading, number sense, Kiswahili confidence, play-based discovery, hygiene routines, and kind classroom habits.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Upper Primary",
    meta: "Class 4 to Class 6",
    text: "Stronger writing, sciences, social studies, digital literacy, leadership roles, and CBC portfolio readiness.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Clubs & Talent",
    meta: "After class",
    text: "Music, football, debate, art, environmental care, coding basics, and mentorship for confident self-expression.",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80"
  }
];

const updates = [
  ["June 28", "Parent consultation morning for Term 2 progress reviews"],
  ["July 05", "Class 4 and Class 5 science exhibition showcase"],
  ["July 19", "Inter-house games and family sports afternoon"]
];

function App() {
  return (
    <main className="site-shell">
      <Navigation />
      <Hero />
      <RecognitionStrip />
      <About />
      <Approach />
      <Programs />
      <Updates />
      <ParentPromise />
      <Contact />
    </main>
  );
}

function Navigation() {
  return (
    <header className="nav">
      <a className="brand" href="#top" aria-label="Brooks School home">
        <span className="brand-mark">B</span>
        <span>Brooks School</span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#learning">Learning</a>
        <a href="#updates">Updates</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="nav-action" href="#contact">
        Admissions <ArrowUpRight size={17} />
      </a>
      <button className="menu-button" aria-label="Open menu">
        <Menu size={22} />
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero section-grid">
      <div className="hero-kicker">
        <span>/ Nairobi, Kenya</span>
        <span>Primary School</span>
      </div>
      <div className="hero-title">
        <p className="eyebrow">Official School Website</p>
        <h1>
          Brooks
          <br />
          School
        </h1>
      </div>
      <div className="hero-card">
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80"
          alt="Primary school learners in a bright classroom"
        />
        <div>
          <p>
            A caring Kenyan primary school helping children grow in academics,
            character, creativity, and confidence.
          </p>
          <a href="#about">
            Our Story <ChevronRight size={18} />
          </a>
        </div>
      </div>
      <div className="hero-stat">
        <strong>Parent-ready</strong>
        <span>Simple updates, clear results, and approachable communication.</span>
      </div>
    </section>
  );
}

function RecognitionStrip() {
  return (
    <section className="recognition" aria-label="School highlights">
      {recognition.map((item) => (
        <div key={item}>
          <Trophy size={18} />
          <span>{item}</span>
        </div>
      ))}
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about section-grid">
      <div>
        <p className="eyebrow">About Brooks</p>
        <h2>Designed for children, clear for parents.</h2>
      </div>
      <p className="lead">
        Brooks School blends strong classroom routines with a warm community feel.
        Learners are known by name, parents are kept close to progress, and every
        school day is shaped around safety, respect, curiosity, and effort.
      </p>
      <div className="stat-row">
        {stats.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="learning" className="approach">
      <div className="section-heading">
        <p className="eyebrow">Our Approach</p>
        <h2>Structured learning with a human touch.</h2>
      </div>
      <div className="approach-grid">
        {approach.map((item) => (
          <article className="approach-card" key={item.title}>
            <div>
              <span>{item.progress} complete</span>
              <strong>{item.tag}</strong>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section className="programs">
      <div className="section-heading">
        <p className="eyebrow">Learning Pathways</p>
        <h2>Every class has a clear rhythm.</h2>
      </div>
      <div className="program-grid">
        {programs.map((program) => (
          <article className="program-card" key={program.title}>
            <img src={program.image} alt="" />
            <div>
              <span>{program.meta}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Updates() {
  return (
    <section id="updates" className="updates section-grid">
      <div>
        <p className="eyebrow">School Updates</p>
        <h2>What families should know next.</h2>
      </div>
      <div className="update-list">
        {updates.map(([date, title]) => (
          <article key={title}>
            <span>{date}</span>
            <p>{title}</p>
            <ArrowUpRight size={20} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ParentPromise() {
  const items = [
    [ShieldCheck, "Safe routines"],
    [BookOpen, "Readable results"],
    [HeartHandshake, "Open communication"],
    [GraduationCap, "Academic growth"]
  ];

  return (
    <section className="promise">
      <div className="promise-panel">
        <Sparkles size={24} />
        <h2>A school website parents can actually use.</h2>
        <p>
          Public news, admissions guidance, school calendar, contacts, learning
          information, and parent resources will live here as the site grows.
        </p>
      </div>
      <div className="promise-grid">
        {items.map(([Icon, label]) => (
          <div key={label}>
            <Icon size={22} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Visit Brooks School or speak with admissions.</h2>
      </div>
      <div className="contact-grid">
        <a href="tel:+254700000000">
          <Phone size={19} />
          +254 700 000 000
        </a>
        <a href="mailto:info@brooksschool.sc.ke">
          <Mail size={19} />
          info@brooksschool.sc.ke
        </a>
        <a href="https://brooksschool.sc.ke">
          <MapPin size={19} />
          brooksschool.sc.ke
        </a>
        <a href="#updates">
          <CalendarDays size={19} />
          View school calendar
        </a>
      </div>
      <div className="footer-bottom">
        <span>Brooks School</span>
        <span>Official public website concept</span>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
