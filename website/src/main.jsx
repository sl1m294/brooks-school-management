import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import "./styles.css";

const awards = ["CBC Ready", "Parent Partnership", "Safe Campus", "Values Led"];

const stats = [
  [18, "+", "Learning clubs and co-curricular pathways"],
  [24, "", "Learners per stream target for personal attention"],
  [4, "", "Core pillars: academics, values, creativity, care"]
];

const approach = [
  {
    title: "Research",
    tag: "Foundation",
    progress: "30% complete",
    text: "We understand each learner's strengths, home context, reading level, confidence, and support needs before setting goals."
  },
  {
    title: "Build & Guide",
    tag: "Daily Practice",
    progress: "70% complete",
    text: "Teachers use clear routines, strong literacy and numeracy practice, creative projects, feedback, and respectful classroom culture."
  },
  {
    title: "Report & Grow",
    tag: "Parent Loop",
    progress: "100% complete",
    text: "Parents receive simple updates, attendance notes, exam results, calendar reminders, and next steps they can act on."
  }
];

const programs = [
  ["Lower Primary", "PP1 to Class 3", "Reading, Kiswahili confidence, number sense, play-based discovery, and kind classroom habits."],
  ["Upper Primary", "Class 4 to Class 6", "Writing, sciences, social studies, digital basics, leadership roles, and CBC portfolio readiness."],
  ["Clubs & Talent", "After class", "Music, football, debate, art, environmental care, coding basics, and guided self-expression."]
];

const updates = [
  ["June 28", "Parent consultation morning for Term 2 progress reviews"],
  ["July 05", "Class 4 and Class 5 science exhibition showcase"],
  ["July 19", "Inter-house games and family sports afternoon"]
];

function App() {
  useRevealAnimation();

  return (
    <main className="site-shell">
      <Navigation />
      <Hero />
      <AwardMarquee />
      <About />
      <Approach />
      <Programs />
      <Updates />
      <ParentPromise />
      <Contact />
    </main>
  );
}

function useRevealAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-KE", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Africa/Nairobi"
        }).format(new Date())
      );
    };
    tick();
    const timer = window.setInterval(tick, 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

function useCountUp(target, isActive) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return undefined;

    let frameId;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, isActive]);

  return value;
}

function AnimatedNumber({ target, suffix = "" }) {
  const [isActive, setIsActive] = useState(false);
  const numberRef = useRef(null);
  const count = useCountUp(target, isActive);

  useEffect(() => {
    if (!numberRef.current || isActive) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(numberRef.current);
    return () => observer.disconnect();
  }, [isActive]);

  return (
    <span ref={numberRef}>
      {count}
      {suffix}
    </span>
  );
}

function SlidingButton({ href, children, light = false }) {
  return (
    <a className={light ? "slide-button light" : "slide-button"} href={href}>
      <span>{children}</span>
      <span>{children}</span>
    </a>
  );
}

function Navigation() {
  const time = useClock();

  return (
    <header className="topbar">
      <div className="nav-panel">
        <button className="menu-pill" aria-label="Open menu">
          <Menu size={18} />
          <span>Menu</span>
        </button>
        <a className="wordmark" href="#top" aria-label="Brooks School home">
          <span className="school-mark">B</span>
          <span>Brooks School</span>
        </a>
        <div className="nav-right">
          <div className="place-time">
            <span>Nairobi, Kenya</span>
            <span>{time}</span>
          </div>
          <a className="admission-link" href="#contact">
            <span>Admissions</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-dark">
      <div className="hero-name" data-reveal>
        <h1>Brooks</h1>
        <p>A caring Kenyan primary school crafting confident learners, clear parent communication, and a warm daily rhythm.</p>
      </div>

      <div className="hero-bottom">
        <div className="client-block" data-reveal>
          <strong>520+</strong>
          <span>Families served through learning, care, and values.</span>
          <SlidingButton href="#about">Our Story</SlidingButton>
        </div>

        <div className="hero-image-wrap" data-reveal>
          <img
            src="https://images.unsplash.com/photo-1620969910995-4bbe4eaa32c1?auto=format&fit=crop&fm=jpg&q=80&w=1600"
            alt="Learners in red uniforms seated in a classroom"
          />
        </div>

        <div className="hero-badges" data-reveal>
          <span>1ST CHOICE</span>
          <span>PARENT READY</span>
          <span>CBC ALIGNED</span>
        </div>
      </div>
    </section>
  );
}

function AwardMarquee() {
  const repeated = [...awards, ...awards, ...awards];

  return (
    <section className="award-stage" aria-label="School highlights">
      <div className="award-track">
        {repeated.map((award, index) => (
          <article key={`${award}-${index}`}>
            <strong>{award}</strong>
            <p>{index % 2 === 0 ? "Brooks School 2026" : "For growing learners"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about-dark">
      <div className="side-copy" data-reveal>
        <p>Redefining primary school communication with a parent-friendly public website and a learner-first school culture.</p>
        <SlidingButton href="#learning" light>
          About Brooks
        </SlidingButton>
      </div>
      <div className="stat-stack">
        {stats.map(([value, suffix, label]) => (
          <article key={label} data-reveal>
            <h2>
              <AnimatedNumber target={value} suffix={suffix} />
            </h2>
            <p>{label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="learning" className="process">
      <div className="section-title" data-reveal>
        <p>Process</p>
        <h2>Our Approach</h2>
        <span>We provide thoughtful learning support adapted for every class and every home.</span>
      </div>

      <div className="process-grid">
        {approach.map((item) => (
          <article className="process-card" key={item.title} data-reveal>
            <div>
              <span>{item.progress}</span>
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
    <section className="program-showcase">
      <div className="section-title" data-reveal>
        <p>Learning</p>
        <h2>Featured Pathways</h2>
        <span>Public information parents can scan quickly before visiting or calling the school.</span>
      </div>

      <div className="program-list">
        {programs.map(([title, meta, text], index) => (
          <article key={title} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{meta}</p>
              <h3>{title}</h3>
            </div>
            <p>{text}</p>
            <ArrowUpRight size={24} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Updates() {
  return (
    <section id="updates" className="updates-dark">
      <div className="section-title" data-reveal>
        <p>Updates</p>
        <h2>School News</h2>
      </div>
      <div className="update-list">
        {updates.map(([date, title]) => (
          <article key={title} data-reveal>
            <span>{date}</span>
            <p>{title}</p>
            <ArrowUpRight size={24} />
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
    <section className="promise-dark">
      <div className="promise-image" data-reveal>
        <img
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85"
          alt="Open books in a school library"
        />
      </div>
      <div className="promise-copy" data-reveal>
        <Sparkles size={24} />
        <h2>A school website parents can actually use.</h2>
        <p>Admissions, term dates, updates, learning information, contacts, and parent resources will live here as the official website grows.</p>
        <div>
          {items.map(([Icon, label]) => (
            <span key={label}>
              <Icon size={18} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="footer-dark">
      <div data-reveal>
        <p>Start Here</p>
        <h2>Visit Brooks School or speak with admissions.</h2>
      </div>
      <div className="contact-links" data-reveal>
        <a href="tel:+254700000000">
          <Phone size={18} /> +254 700 000 000
        </a>
        <a href="mailto:info@brooksschool.sc.ke">
          <Mail size={18} /> info@brooksschool.sc.ke
        </a>
        <a href="https://brooksschool.sc.ke">
          <MapPin size={18} /> brooksschool.sc.ke
        </a>
        <a href="#updates">
          <CalendarDays size={18} /> View school calendar
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
