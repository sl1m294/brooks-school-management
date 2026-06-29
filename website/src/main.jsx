import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  GraduationCap,
  HeartHandshake,
  Image,
  LogIn,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import "./styles.css";

const logo = "/assets/brooks-logo-transparent.png";
const heroImage =
  "https://images.unsplash.com/photo-1620969910995-4bbe4eaa32c1?auto=format&fit=crop&fm=jpg&q=82&w=1800";
const ADMIN_TOKEN_KEY = "brooks_website_admin_token";
const ADMIN_LAST_ACTIVE_KEY = "brooks_website_admin_last_active";
const ADMIN_INACTIVITY_LIMIT_MS = 1000 * 60 * 30;

const pages = [
  ["home", "Home"],
  ["about", "About Us"],
  ["academics", "Academics"],
  ["admissions", "Admissions"],
  ["school-life", "School Life"],
  ["gallery", "Gallery"],
  ["parents", "Parents' Corner"],
  ["news", "News & Events"],
  ["facilities", "Facilities"],
  ["downloads", "Downloads"],
  ["contact", "Contact"],
];
const validPageSlugs = new Set([...pages.map(([slug]) => slug), "login", "admin"]);

const stats = [
  [520, "+", "Learners supported across early years and primary classes"],
  [36, "", "Teaching and support staff focused on learner wellbeing"],
  [18, "", "Classrooms, learning rooms, and activity spaces"],
  [12, "+", "Years of excellence, care, and parent partnership"],
];

const whyChooseUs = [
  [
    GraduationCap,
    "CBC Curriculum",
    "Learning activities are aligned to Kenya's competency-based approach.",
  ],
  [
    Users,
    "Qualified Teachers",
    "Warm, prepared teachers who know children by name and need.",
  ],
  [
    ShieldCheck,
    "Safe Environment",
    "Clear routines, supervised spaces, and a caring school culture.",
  ],
  [
    BookOpen,
    "Holistic Education",
    "Strong academics balanced with values, creativity, and talent growth.",
  ],
  [
    Sparkles,
    "Modern Facilities",
    "Practical spaces for reading, ICT basics, science, play, and clubs.",
  ],
  [
    HeartHandshake,
    "Parent Partnership",
    "Simple communication for updates, calendars, results, and support.",
  ],
];

const news = [
  [
    "Term 2 Opening Update",
    "June 28, 2026",
    "Administration",
    "Parents are reminded to review the term calendar, uniform checklist, and arrival routines.",
  ],
  [
    "CBC Project Showcase",
    "July 5, 2026",
    "Academics",
    "Learners will present class projects in science, agriculture, creative arts, and ICT.",
  ],
  [
    "Inter-House Games Day",
    "July 19, 2026",
    "School Life",
    "Families are invited for athletics, football, teamwork activities, and class displays.",
  ],
];

const events = [
  [
    "02 Jul",
    "Parent consultation morning",
    "Class teachers meet parents for academic and wellbeing updates.",
  ],
  [
    "12 Jul",
    "Environmental club clean-up",
    "Learners practise community care and environmental responsibility.",
  ],
  [
    "26 Jul",
    "Music and drama afternoon",
    "A friendly showcase for confidence, voice, rhythm, and teamwork.",
  ],
];

const values = [
  "Respect",
  "Integrity",
  "Excellence",
  "Responsibility",
  "Creativity",
  "Service",
];

const subjects = [
  "English",
  "Kiswahili",
  "Mathematics",
  "Integrated Science",
  "Social Studies",
  "Agriculture",
  "Creative Arts",
  "Religious Education",
  "ICT",
];
const classes = [
  "PP1",
  "PP2",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Junior School",
];

const schoolLife = [
  ["Sports", "Football, athletics, games, and teamwork activities."],
  ["Music", "Songs, rhythm, performance confidence, and school events."],
  ["Drama", "Creative expression, public speaking, and storytelling."],
  ["Debate", "Clear thinking, respectful disagreement, and confidence."],
  ["Clubs", "Talent pathways for art, reading, technology, and service."],
  ["Scouts", "Discipline, leadership, responsibility, and outdoor skills."],
  [
    "Environmental Club",
    "Tree care, clean-up days, and practical stewardship.",
  ],
  ["School Trips", "Guided learning visits connected to class work."],
];

const leaders = [
  [
    "Mrs. Grace Chebet",
    "Headteacher",
    "Leadership",
    "Guides academic culture, learner care, and parent partnership.",
  ],
  [
    "Mr. Daniel Kiprono",
    "Deputy Headteacher",
    "Operations",
    "Supports daily routines, discipline, and school programmes.",
  ],
];

const facilities = [
  "Classrooms",
  "Library",
  "ICT Lab",
  "Science Room",
  "Playground",
  "Dining Hall",
  "School Bus",
  "School Farm",
  "First Aid Room",
  "Security",
];

const downloads = [
  ["Admission Form", "PDF", "Application form for new learners"],
  ["Fee Structure", "PDF", "Current term fee guide placeholder"],
  ["School Calendar", "PDF", "Term dates, visits, events, and closing days"],
  ["Uniform Guide", "PDF", "Uniform list and school presentation guide"],
  ["CBC Assessment Schedule", "PDF", "Assessment windows and parent notes"],
  ["Holiday Assignments", "ZIP", "Class-based activity packs"],
];

const galleryCategories = [
  "Classrooms",
  "Sports",
  "Events",
  "Graduation",
  "Learning Activities",
  "ICT Lab",
  "Library",
  "School Grounds",
];

const socialLinks = [
  ["Facebook", "https://facebook.com", FacebookIcon, "facebook"],
  ["Instagram", "https://instagram.com", InstagramIcon, "instagram"],
  ["X", "https://x.com", XIcon, "x"],
  ["YouTube", "https://youtube.com", YouTubeIcon, "youtube"],
];

function BrandIcon({ children }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {children}
    </svg>
  );
}

function FacebookIcon() {
  return (
    <BrandIcon>
      <path d="M14 8.8V7.1c0-.7.5-.9 1-.9h1.8V3.1C16.5 3 15.4 3 14.1 3c-2.8 0-4.7 1.7-4.7 4.8v1H6.7v3.5h2.7V21h3.7v-8.7h3l.5-3.5H13.1Z" />
    </BrandIcon>
  );
}

function InstagramIcon() {
  return (
    <BrandIcon>
      <path d="M7.6 2.8h8.8a4.8 4.8 0 0 1 4.8 4.8v8.8a4.8 4.8 0 0 1-4.8 4.8H7.6a4.8 4.8 0 0 1-4.8-4.8V7.6a4.8 4.8 0 0 1 4.8-4.8Zm0 1.8a3 3 0 0 0-3 3v8.8a3 3 0 0 0 3 3h8.8a3 3 0 0 0 3-3V7.6a3 3 0 0 0-3-3H7.6Zm4.4 3.1a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6Zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.6-2.6a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1Z" />
    </BrandIcon>
  );
}

function XIcon() {
  return (
    <BrandIcon>
      <path d="M14.2 10.3 21 3h-2.2l-5.6 6.1L8.7 3H3l7.1 9.5L3 21h2.2l5.9-6.7 4.9 6.7h5.7Zm-2 2.3-.9-1.2-4-5.7h1.2l3.5 5 .9 1.2 4.5 6.4h-1.2Z" />
    </BrandIcon>
  );
}

function YouTubeIcon() {
  return (
    <BrandIcon>
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.8 3.4Z" />
    </BrandIcon>
  );
}

function App() {
  const [page, setPage] = useState(() => getInitialPage());
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [websiteEvents, setWebsiteEvents] = useState(events);
  const [websiteNews, setWebsiteNews] = useState(news);

  useRevealAnimation(page);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const [eventsResponse, newsResponse] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/news"),
        ]);
        if (!eventsResponse.ok || !newsResponse.ok) return;
        const eventsBody = await eventsResponse.json();
        const newsBody = await newsResponse.json();
        const nextEvents = Array.isArray(eventsBody.data)
          ? eventsBody.data.map((event) => [event.date, event.title, event.description])
          : [];
        const nextNews = Array.isArray(newsBody.data)
          ? newsBody.data.map((item) => [
              item.title,
              item.date,
              item.category,
              item.description,
            ])
          : [];
        if (isMounted && nextEvents.length) setWebsiteEvents(nextEvents);
        if (isMounted && nextNews.length) setWebsiteNews(nextNews);
      } catch {
        // Keep the built-in content if the website API is not configured yet.
      }
    }

    loadContent();

    const onEventsUpdated = (event) => {
      const nextEvents = event.detail?.events;
      if (Array.isArray(nextEvents) && nextEvents.length) {
        setWebsiteEvents(nextEvents.map((item) => [item.date, item.title, item.description]));
      }
    };
    const onNewsUpdated = (event) => {
      const nextNews = event.detail?.news;
      if (Array.isArray(nextNews) && nextNews.length) {
        setWebsiteNews(
          nextNews.map((item) => [
            item.title,
            item.date,
            item.category,
            item.description,
          ]),
        );
      }
    };

    window.addEventListener("website-events-updated", onEventsUpdated);
    window.addEventListener("website-news-updated", onNewsUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("website-events-updated", onEventsUpdated);
      window.removeEventListener("website-news-updated", onNewsUpdated);
    };
  }, []);

  useEffect(() => {
    const onPopState = () => setPage(getInitialPage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const currentLabel = pages.find(([slug]) => slug === page)?.[1] || "Home";

  const navigate = (slug) => {
    setPage(slug);
    setMenuOpen(false);
    window.history.pushState({}, "", slug === "home" ? "/" : `/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={darkMode ? "site-shell dark-mode" : "site-shell"}>
      <Navigation
        currentPage={page}
        currentLabel={currentLabel}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
        onNavigate={navigate}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
      />
      {menuOpen && (
        <MenuOverlay
          currentPage={page}
          onNavigate={navigate}
          onClose={() => setMenuOpen(false)}
        />
      )}
      <PageRouter
        page={page}
        onNavigate={navigate}
        events={websiteEvents}
        news={websiteNews}
      />
      <SiteFooter onNavigate={navigate} />
      <button
        className="back-to-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowRight size={18} />
      </button>
    </main>
  );
}

function getInitialPage() {
  const slug = window.location.pathname.replace("/", "") || "home";
  return validPageSlugs.has(slug) ? slug : "home";
}

function useRevealAnimation(trigger) {
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
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [trigger]);
}

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-KE", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Africa/Nairobi",
        }).format(new Date()),
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
    const duration = 1500;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
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
      { threshold: 0.4 },
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

function Navigation({
  currentPage,
  currentLabel,
  menuOpen,
  onMenuToggle,
  onNavigate,
  darkMode,
  onToggleTheme,
}) {
  const time = useClock();

  return (
    <header className="topbar">
      <div className="nav-panel">
        <button
          className="menu-pill"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={onMenuToggle}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>

        <button
          className="wordmark"
          aria-label="Brooks School home"
          onClick={() => onNavigate("home")}
        >
          <img src={logo} alt="" />
          <span>Brooks School</span>
        </button>

        <div className="nav-right">
          <div className="place-time">
            <span>Eldoret, Kenya</span>
            <span>{time}</span>
          </div>
          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={onToggleTheme}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="admission-link login-link"
            type="button"
            onClick={() => onNavigate("login")}
            aria-label="Open Brooks School login page"
          >
            <LogIn size={16} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MenuOverlay({ currentPage, onNavigate, onClose }) {
  return (
    <div
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Website menu"
    >
      <div className="menu-card">
        <div className="menu-card-top">
          <div>
            <img src={logo} alt="Brooks School logo" />
            <p>Official school website</p>
          </div>
          <button aria-label="Close menu" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="menu-body">
          <nav className="menu-grid" aria-label="Main navigation">
            {pages.map(([slug, label]) => (
              <button
                className={currentPage === slug ? "is-active" : ""}
                key={slug}
                onClick={() => onNavigate(slug)}
              >
                <span>{label}</span>
                <ArrowRight size={17} />
              </button>
            ))}
          </nav>
          <aside className="menu-aside">
            <p>Quick actions</p>
            <button onClick={() => onNavigate("admissions")}>
              Admissions
              <ArrowUpRight size={16} />
            </button>
            <button onClick={() => onNavigate("contact")}>
              Contact Office
              <ArrowUpRight size={16} />
            </button>
            <div>
              <span>Eldoret, Kenya</span>
              <strong>Open weekdays, 8:00 AM - 4:30 PM</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PageRouter({ page, onNavigate, events, news }) {
  const route = {
    home: <HomePage onNavigate={onNavigate} events={events} news={news} />,
    about: <AboutPage />,
    academics: <AcademicsPage />,
    admissions: <AdmissionsPage onNavigate={onNavigate} />,
    "school-life": <SchoolLifePage />,
    gallery: <GalleryPage />,
    parents: <ParentsPage />,
    news: <NewsPage events={events} news={news} />,
    facilities: <FacilitiesPage />,
    downloads: <DownloadsPage />,
    contact: <ContactPage />,
    login: <DummyLoginPage />,
    admin: <WebsiteAdminPage />,
  };

  return route[page] || <HomePage onNavigate={onNavigate} />;
}

function SlidingButton({ children, onClick, variant = "light" }) {
  return (
    <button className={`slide-button ${variant}`} onClick={onClick}>
      <span>{children}</span>
      <span>{children}</span>
    </button>
  );
}

function HomePage({ onNavigate, events, news }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <HighlightMarquee />
      <StatsSection />
      <WhyChooseUs />
      <NewsEventsBlock onNavigate={onNavigate} events={events} news={news} />
      <Testimonials />
      <CallToAction onNavigate={onNavigate} />
    </>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="hero-dark">
      <div className="hero-name" data-reveal>
        <img className="mobile-hero-logo" src={logo} alt="Brooks School logo" />
        <h1>Brooks School</h1>
        <p>
          Maroon pride, navy confidence, and a caring Kenyan primary school
          rhythm for growing learners.
        </p>
      </div>

      <div className="hero-bottom">
        <div className="client-block" data-reveal>
          <strong>920+</strong>
          <span>
            Families served through learning, care, values, and parent
            partnership.
          </span>
          <SlidingButton onClick={() => onNavigate("about")}>
            Our Story
          </SlidingButton>
        </div>

        <div className="hero-image-wrap" data-reveal>
          <img
            src={heroImage}
            alt="Learners in red uniforms seated in a classroom"
          />
        </div>

        <div className="hero-badges" data-reveal>
          <span>CBC READY</span>
          <span>PARENT PARTNERSHIP</span>
          <span>VALUES LED</span>
        </div>
      </div>
    </section>
  );
}

function HighlightMarquee() {
  const labels = [
    "Safe Campus",
    "CBC Learning",
    "Parent Updates",
    "Creative Arts",
    "Sports",
    "Reading Culture",
    "ICT Basics",
    "Values Led",
  ];
  const repeated = [...labels, ...labels, ...labels];

  return (
    <section className="award-stage" aria-label="School highlights">
      <div className="award-track">
        {repeated.map((label, index) => (
          <article key={`${label}-${index}`}>
            <strong>{label}</strong>
            <p>
              {index % 2 === 0
                ? "Brooks School 2026"
                : "For confident learners"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="about-dark">
      <div className="side-copy" data-reveal>
        <p>
          At Brooks School, we believe every child deserves a strong foundation
          for a bright future. Stay up to date with admissions, school events,
          academic calendars, results, and the latest news from our school
          community in Eldoret.
        </p>
        <a className="text-link" href="#news-preview">
          View Latest Updates
        </a>
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

function WhyChooseUs() {
  return (
    <section className="page-section why-section">
      <SectionTitle
        eyebrow="Why Choose Us"
        title="Built for children. Clear for parents."
        text="The website is organised around the questions families usually ask before choosing a primary school."
      />
      <div className="feature-grid">
        {whyChooseUs.map(([Icon, title, text]) => (
          <article className="feature-card" key={title} data-reveal>
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsEventsBlock({ onNavigate, events, news }) {
  return (
    <section id="news-preview" className="split-section">
      <div data-reveal>
        <SectionTitle
          align="left"
          eyebrow="Latest News"
          title="Useful updates at a glance."
          text="Dummy content for now, ready for real school announcements."
        />
        <div className="news-list">
          {news.slice(0, 3).map(([title, date, category, text]) => (
            <article key={title}>
              <span>
                {date} / {category}
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="events-card" data-reveal>
        <CalendarDays size={28} />
        <h2>Upcoming Events</h2>
        {events.map(([date, title, text]) => (
          <article key={title}>
            <strong>{date}</strong>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
        <SlidingButton onClick={() => onNavigate("news")} variant="dark">
          All Events
        </SlidingButton>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="testimonial-band">
      <div data-reveal>
        <p>
          "Brooks School communicates clearly, treats children with care, and
          helps parents feel involved in the learning journey."
        </p>
        <span>Parent testimonial placeholder</span>
      </div>
      <div data-reveal>
        <p>
          "The school balances academics, values, play, and discipline in a way
          that feels warm and structured."
        </p>
        <span>Parent testimonial placeholder</span>
      </div>
    </section>
  );
}

function CallToAction({ onNavigate }) {
  return (
    <section className="cta-section" data-reveal>
      <Sparkles size={28} />
      <h2>Ready to learn more about Brooks School?</h2>
      <p>
        Admissions, visits, fee guidance, and parent questions can all start
        from the contact page.
      </p>
      <div>
        <SlidingButton onClick={() => onNavigate("admissions")}>
          Apply Now
        </SlidingButton>
        <SlidingButton onClick={() => onNavigate("contact")} variant="outline">
          Contact Us
        </SlidingButton>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <SubPage
      eyebrow="About Brooks"
      title="Nurturing young minds. Building bright futures."
    >
      <ContentGrid
        items={[
          [
            "School History",
            "Brooks School has grown as a community-minded primary school focused on strong foundations, respectful discipline, and parent partnership.",
          ],
          [
            "Mission",
            "To nurture confident, responsible, and creative learners through excellent teaching, values, and practical CBC learning experiences.",
          ],
          [
            "Vision",
            "To be a trusted Kenyan school where every child is known, supported, challenged, and prepared for lifelong learning.",
          ],
          [
            "School Philosophy",
            "Children thrive when school and home work together. Brooks keeps learning structured, communication simple, and care visible.",
          ],
        ]}
      />
      <section className="values-band">
        <SectionTitle
          eyebrow="Core Values"
          title="What guides the school day."
          text="These placeholders can be replaced with the official Brooks School values."
        />
        <PillGrid items={values} />
      </section>
      <LeadershipBlock />
      <Timeline />
    </SubPage>
  );
}

function AcademicsPage() {
  return (
    <SubPage
      eyebrow="Academics"
      title="CBC-aligned learning for early years, primary, and junior school."
    >
      <ContentGrid
        items={[
          [
            "CBC Curriculum",
            "Learners build competencies through practical tasks, communication, creativity, collaboration, citizenship, and self-efficacy.",
          ],
          [
            "Learning Approach",
            "Teachers combine direct instruction, guided practice, class projects, reading culture, assessment feedback, and parent updates.",
          ],
          [
            "Assessment Methods",
            "Continuous assessment, class tasks, project work, observation, written checks, and progress conversations support growth.",
          ],
        ]}
      />
      <SectionTitle
        className="classes-title"
        eyebrow="Classes Offered"
        title="A Kenyan school structure parents recognise."
      />
      <PillGrid items={classes} />
      <SectionTitle
        eyebrow="Subjects"
        title="Broad learning for confident children."
      />
      <PillGrid items={subjects} />
      <ResponsiveTable />
    </SubPage>
  );
}

function AdmissionsPage({ onNavigate }) {
  return (
    <SubPage
      eyebrow="Admissions"
      title="A simple, parent-friendly enrolment journey."
    >
      <div className="step-grid">
        {[
          "Make an enquiry",
          "Visit the school",
          "Submit documents",
          "Learner placement",
          "Confirm admission",
        ].map((step, index) => (
          <article key={step} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Aspernatur facere eligendi soluta autem?
            </p>
          </article>
        ))}
      </div>
      <ContentGrid
        items={[
          [
            "Required Documents",
            "Birth certificate, parent or guardian ID, previous school report, passport photos, and medical notes where applicable.",
          ],
          [
            "Age Requirements",
            "Placement is based on age, prior learning, readiness, and a conversation with the admissions office.",
          ],
          [
            "Fees Structure",
            "A downloadable fee structure will be placed here once approved by the school manager.",
          ],
          [
            "School Uniform",
            "Uniform photos, supplier contacts, and presentation guidance can be added when available.",
          ],
        ]}
      />
      <section className="inline-cta" data-reveal>
        <h2>Need admission help?</h2>
        <p>Talk to the office and book a school visit.</p>
        <SlidingButton onClick={() => onNavigate("contact")} variant="dark">
          Contact Admissions
        </SlidingButton>
      </section>
      <FaqBlock />
    </SubPage>
  );
}

function SchoolLifePage() {
  return (
    <SubPage
      eyebrow="School Life"
      title="A balanced school day with academics, talent, service, and play."
    >
      <CardGrid items={schoolLife} />
    </SubPage>
  );
}

function GalleryPage() {
  return (
    <SubPage
      eyebrow="Gallery"
      title="A photo-led view of daily life at Brooks School."
    >
      <PillGrid items={galleryCategories} />
      <div className="gallery-grid">
        {galleryCategories.map((item, index) => (
          <article key={item} data-reveal>
            <Image size={28} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item}</h3>
          </article>
        ))}
      </div>
    </SubPage>
  );
}

function ParentsPage() {
  return (
    <SubPage
      eyebrow="Parents' Corner"
      title="A practical place for calendars, policies, payments, and updates."
    >
      <ContentGrid
        items={[
          [
            "School Calendar",
            "Term dates, events, closing days, consultation mornings, and activity days.",
          ],
          [
            "Homework Information",
            "Class-level homework guidance and holiday activity instructions.",
          ],
          [
            "Fee Payment Information",
            "Payment channels, account details, deadlines, and office support notes.",
          ],
          [
            "Parent Handbook",
            "School routines, uniform expectations, communication channels, and learner support.",
          ],
          [
            "School Policies",
            "Safeguarding, attendance, transport, discipline, ICT, and visitor policies.",
          ],
          [
            "PTA Meetings",
            "Meeting dates, agendas, and reminders for parent-teacher engagement.",
          ],
        ]}
      />
    </SubPage>
  );
}

function NewsPage({ events, news }) {
  return (
    <SubPage
      eyebrow="News & Events"
      title="Announcements, activities, and school stories."
    >
      <div className="events-card news-events-card" data-reveal>
        <CalendarDays size={28} />
        <h2>Upcoming Events</h2>
        {events.map(([date, title, text]) => (
          <article key={title}>
            <strong>{date}</strong>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="article-grid">
        {news.map(([title, date, category, text], index) => (
          <article key={`${title}-${index}`} data-reveal>
            <span>{category}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <small>{date} / Brooks School</small>
          </article>
        ))}
      </div>
    </SubPage>
  );
}

function FacilitiesPage() {
  return (
    <SubPage
      eyebrow="Facilities"
      title="Spaces that support learning, care, movement, and safety."
    >
      <CardGrid
        items={facilities.map((item) => [
          item,
          "Placeholder description for this facility. Real photos and details can be added as we collect them.",
        ])}
      />
    </SubPage>
  );
}

function DownloadsPage() {
  return (
    <SubPage
      eyebrow="Downloads"
      title="Useful school documents in one easy place."
    >
      <div className="download-grid">
        {downloads.map(([title, type, text]) => (
          <article key={title} data-reveal>
            <FileText size={28} />
            <span>{type}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <button>
              <Download size={18} />
              Download
            </button>
          </article>
        ))}
      </div>
    </SubPage>
  );
}

function normalizeKenyanPhone(value) {
  let digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("2540")) {
    digits = `254${digits.slice(4)}`;
  } else if (digits.startsWith("0")) {
    digits = `254${digits.slice(1)}`;
  } else if (!digits.startsWith("254")) {
    digits = `254${digits}`;
  }

  return `+${digits.slice(0, 12)}`;
}

function ContactPage() {
  const [phone, setPhone] = useState("");

  return (
    <SubPage
      eyebrow="Contact"
      title="Visit, call, or send a message to Brooks School."
    >
      <section className="contact-layout">
        <div className="contact-card" data-reveal>
          <h2>Contact Information</h2>
          <a href="tel:+254725389016">
            <Phone size={18} /> +254 725 389 016
          </a>
          <a href="mailto:info@brooksschool.sc.ke">
            <Mail size={18} /> info@brooksschool.sc.ke
          </a>
          <span>
            <MapPin size={18} /> Eldoret, Kenya
          </span>
          <span>
            <CalendarDays size={18} /> Monday to Friday, 8:00 AM - 4:30 PM
          </span>
        </div>
        <form className="contact-form" data-reveal>
          <label>
            Name
            <input required placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Phone
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) =>
                setPhone(normalizeKenyanPhone(event.target.value))
              }
              placeholder="+2547..."
            />
          </label>
          <label>
            Subject
            <input required placeholder="Admissions enquiry" />
          </label>
          <label>
            Message
            <textarea required placeholder="How can we help?" />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </SubPage>
  );
}

function DummyLoginPage() {
  return (
    <SubPage
      eyebrow="Login"
      title="Brooks School portal access is coming soon."
    >
      <section className="dummy-login-layout">
        <div className="dummy-login-card" data-reveal>
          <img src={logo} alt="Brooks School logo" />
          <p>Parent and staff login</p>
          <h2>Portal under setup</h2>
          <span>
            Soon, parents and staff will use this area to access school updates,
            learner records, attendance, and academic information.
          </span>
          <div
            className="dummy-login-status"
            aria-label="Planned portal access"
          >
            <strong>Parents</strong>
            <strong>Staff</strong>
            <strong>Results</strong>
          </div>
        </div>
        <form className="dummy-login-form" data-reveal>
          <label>
            Email address
            <input type="email" placeholder="you@example.com" disabled />
          </label>
          <label>
            Password
            <input type="password" placeholder="Password" disabled />
          </label>
          <button type="button" disabled>
            Login coming soon
          </button>
        </form>
      </section>
    </SubPage>
  );
}

function WebsiteAdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    const storedToken = window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    const lastActive = Number(window.localStorage.getItem(ADMIN_LAST_ACTIVE_KEY) || 0);

    if (storedToken && Date.now() - lastActive <= ADMIN_INACTIVITY_LIMIT_MS) {
      return storedToken;
    }

    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.localStorage.removeItem(ADMIN_LAST_ACTIVE_KEY);
    return "";
  });
  const [activeEditor, setActiveEditor] = useState("events");
  const [adminEvents, setAdminEvents] = useState(
    events.map(([date, title, description]) => ({ date, title, description })),
  );
  const [adminNews, setAdminNews] = useState(
    news.map(([title, date, category, description]) => ({
      title,
      date,
      category,
      description,
    })),
  );
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let isMounted = true;

    async function loadAdminContent() {
      setStatus("Loading website content...");
      try {
        const [eventsResponse, newsResponse] = await Promise.all([
          fetch("/api/admin-events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin-news", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const eventsBody = await eventsResponse.json();
        const newsBody = await newsResponse.json();
        if (!eventsResponse.ok) {
          throw new Error(eventsBody.error || "Could not load events.");
        }
        if (!newsResponse.ok) {
          throw new Error(newsBody.error || "Could not load news.");
        }
        if (isMounted) {
          setAdminEvents(eventsBody.data);
          setAdminNews(newsBody.data);
          setStatus("");
        }
      } catch (error) {
        if (isMounted) setStatus(error.message);
      }
    }

    loadAdminContent();
    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    const markActive = () => {
      window.localStorage.setItem(ADMIN_LAST_ACTIVE_KEY, String(Date.now()));
    };
    const expireIfInactive = () => {
      const lastActive = Number(window.localStorage.getItem(ADMIN_LAST_ACTIVE_KEY) || 0);
      if (Date.now() - lastActive <= ADMIN_INACTIVITY_LIMIT_MS) return;

      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      window.localStorage.removeItem(ADMIN_LAST_ACTIVE_KEY);
      setToken("");
      setStatus("Logged out after 30 minutes of inactivity.");
    };
    const activityEvents = ["click", "keydown", "mousemove", "scroll", "touchstart"];

    markActive();
    activityEvents.forEach((activityEvent) => {
      window.addEventListener(activityEvent, markActive, { passive: true });
    });
    const expiryTimer = window.setInterval(expireIfInactive, 60 * 1000);

    return () => {
      activityEvents.forEach((activityEvent) => {
        window.removeEventListener(activityEvent, markActive);
      });
      window.clearInterval(expiryTimer);
    };
  }, [token]);

  const login = async (event) => {
    event.preventDefault();
    setStatus("Checking password...");
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not log in.");
      window.localStorage.setItem(ADMIN_TOKEN_KEY, body.token);
      window.localStorage.setItem(ADMIN_LAST_ACTIVE_KEY, String(Date.now()));
      setToken(body.token);
      setPassword("");
      setStatus("");
    } catch (error) {
      setStatus(error.message);
    }
  };

  const updateEvent = (index, field, value) => {
    setAdminEvents((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateNews = (index, field, value) => {
    setAdminNews((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addEvent = () => {
    setAdminEvents((current) => [
      ...current,
      { date: "", title: "", description: "" },
    ]);
  };

  const addNews = () => {
    setAdminNews((current) => [
      ...current,
      { title: "", date: "", category: "Administration", description: "" },
    ]);
  };

  const removeEvent = (index) => {
    setAdminEvents((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeNews = (index) => {
    setAdminNews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveEvents = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving events...");
    try {
      const response = await fetch("/api/admin-events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ events: adminEvents }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save events.");
      setAdminEvents(body.data);
      window.dispatchEvent(
        new CustomEvent("website-events-updated", {
          detail: { events: body.data },
        }),
      );
      setStatus("Events saved. The public website will now show the new list.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveNews = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving latest news...");
    try {
      const response = await fetch("/api/admin-news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ news: adminNews }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save news.");
      setAdminNews(body.data);
      window.dispatchEvent(
        new CustomEvent("website-news-updated", {
          detail: { news: body.data },
        }),
      );
      setStatus("News saved. The public website will now show the new list.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.localStorage.removeItem(ADMIN_LAST_ACTIVE_KEY);
    setToken("");
    setStatus("");
  };

  return (
    <SubPage eyebrow="Website Admin" title="Update public website content.">
      <section className="website-admin-panel">
        <div className="admin-intro" data-reveal>
          <img src={logo} alt="Brooks School logo" />
          <h2>Website Content Editor</h2>
          <p>
            This page is separate from the school management app. It is only for
            updating public website content like upcoming events and latest news.
          </p>
        </div>

        {!token ? (
          <form className="admin-login-form" onSubmit={login} data-reveal>
            <label>
              Website admin password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
              />
            </label>
            <button type="submit">Log in</button>
            {status ? <p className="admin-status">{status}</p> : null}
          </form>
        ) : (
          <div className="admin-editor-wrap" data-reveal>
            <div className="admin-category-tabs" aria-label="Website content categories">
              <button
                className={activeEditor === "events" ? "is-active" : ""}
                type="button"
                onClick={() => setActiveEditor("events")}
              >
                Upcoming Events
              </button>
              <button
                className={activeEditor === "news" ? "is-active" : ""}
                type="button"
                onClick={() => setActiveEditor("news")}
              >
                Latest News
              </button>
            </div>

            {activeEditor === "events" ? (
              <form className="events-editor" onSubmit={saveEvents}>
                <div className="admin-section-heading">
                  <h3>Upcoming Events</h3>
                  <p>Short dated items shown in the Upcoming Events card.</p>
                </div>
                {adminEvents.map((item, index) => (
                  <article key={`${item.title}-${index}`}>
                    <div>
                      <span>Event {index + 1}</span>
                      <button type="button" onClick={() => removeEvent(index)}>
                        Remove
                      </button>
                    </div>
                    <label>
                      Date
                      <input
                        value={item.date}
                        onChange={(event) =>
                          updateEvent(index, "date", event.target.value)
                        }
                        placeholder="02 Jul"
                        required
                      />
                    </label>
                    <label>
                      Title
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateEvent(index, "title", event.target.value)
                        }
                        placeholder="Parent consultation morning"
                        required
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          updateEvent(index, "description", event.target.value)
                        }
                        placeholder="Short event description"
                        required
                      />
                    </label>
                  </article>
                ))}
                <div className="admin-actions">
                  <button type="button" onClick={addEvent}>
                    Add event
                  </button>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Publish events"}
                  </button>
                  <button type="button" onClick={logout}>
                    Log out
                  </button>
                </div>
                {status ? <p className="admin-status">{status}</p> : null}
              </form>
            ) : (
              <form className="events-editor" onSubmit={saveNews}>
                <div className="admin-section-heading">
                  <h3>Latest News</h3>
                  <p>Announcements shown in Latest News and News & Events.</p>
                </div>
                {adminNews.map((item, index) => (
                  <article key={`${item.title}-${index}`}>
                    <div>
                      <span>News {index + 1}</span>
                      <button type="button" onClick={() => removeNews(index)}>
                        Remove
                      </button>
                    </div>
                    <label>
                      Category
                      <select
                        value={item.category}
                        onChange={(event) =>
                          updateNews(index, "category", event.target.value)
                        }
                        required
                      >
                        <option>Administration</option>
                        <option>Academics</option>
                        <option>Admissions</option>
                        <option>School Life</option>
                        <option>Parents</option>
                      </select>
                    </label>
                    <label>
                      Date
                      <input
                        value={item.date}
                        onChange={(event) =>
                          updateNews(index, "date", event.target.value)
                        }
                        placeholder="June 28, 2026"
                        required
                      />
                    </label>
                    <label>
                      Title
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateNews(index, "title", event.target.value)
                        }
                        placeholder="Term 2 Opening Update"
                        required
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          updateNews(index, "description", event.target.value)
                        }
                        placeholder="Short announcement text"
                        required
                      />
                    </label>
                  </article>
                ))}
                <div className="admin-actions">
                  <button type="button" onClick={addNews}>
                    Add news
                  </button>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Publish news"}
                  </button>
                  <button type="button" onClick={logout}>
                    Log out
                  </button>
                </div>
                {status ? <p className="admin-status">{status}</p> : null}
              </form>
            )}
          </div>
        )}
      </section>
    </SubPage>
  );
}

function SubPage({ eyebrow, title, children }) {
  const pageClassName = `${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-page`;

  return (
    <>
      <section className={`subpage-hero ${pageClassName}`}>
        <div data-reveal>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </section>
      <div className="subpage-content">{children}</div>
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  align = "center",
  className = "",
}) {
  return (
    <div
      className={`section-title ${align === "left" ? "align-left" : ""} ${className}`}
      data-reveal
    >
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <span>{text}</span>}
    </div>
  );
}

function ContentGrid({ items }) {
  return (
    <div className="content-grid">
      {items.map(([title, text]) => (
        <article key={title} data-reveal>
          <CheckCircle2 size={22} />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function CardGrid({ items }) {
  return (
    <div className="card-grid">
      {items.map(([title, text], index) => (
        <article key={title} data-reveal>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function PillGrid({ items }) {
  return (
    <div className="pill-grid" data-reveal>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function LeadershipBlock() {
  return (
    <section className="leadership-block">
      <SectionTitle
        eyebrow="Leadership"
        title="Guidance with care and clarity."
      />
      <div className="staff-grid compact">
        {leaders.map(([name, role, subject, bio]) => (
          <article key={name} data-reveal>
            <div className="avatar">
              {name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <span>{role}</span>
            <h3>{name}</h3>
            <strong>{subject}</strong>
            <p>{bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="timeline" data-reveal>
      {[
        "Strong literacy routines",
        "CBC project showcases",
        "Parent communication improvements",
        "Co-curricular growth",
      ].map((item, index) => (
        <article key={item}>
          <span>{2023 + index}</span>
          <p>{item}</p>
        </article>
      ))}
    </section>
  );
}

function ResponsiveTable() {
  const rows = [
    ["Monday", "Literacy", "Mathematics", "Creative Arts", "Clubs"],
    ["Tuesday", "Kiswahili", "Science", "Social Studies", "Sports"],
    ["Wednesday", "Reading", "Mathematics", "Agriculture", "ICT"],
    ["Thursday", "English", "Religious Education", "Project Work", "Music"],
    ["Friday", "Assessment", "Library", "Class Meeting", "Games"],
  ];

  return (
    <section className="table-wrap" data-reveal>
      <h2>Sample Weekly Rhythm</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Morning</th>
            <th>Midday</th>
            <th>Afternoon</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function FaqBlock() {
  const faqs = [
    [
      "Can we visit before applying?",
      "Yes. Families can book a visit and speak with the admissions office.",
    ],
    [
      "Which documents are needed?",
      "Birth certificate, parent ID, recent school report, and passport photos are common requirements.",
    ],
    [
      "Is the curriculum CBC?",
      "Yes. The academic page explains the placeholder CBC structure for now.",
    ],
  ];

  return (
    <section className="faq-block">
      <SectionTitle eyebrow="FAQ" title="Common parent questions." />
      {faqs.map(([question, answer]) => (
        <details key={question} data-reveal>
          <summary>
            {question}
            <ChevronDown size={18} />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}

function SiteFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer-dark">
      <div data-reveal>
        <img src={logo} alt="Brooks School logo" />
        <p>
          Your gateway to Brooks School—find admissions information, school
          news, learning resources, calendars, and everything parents need to
          stay connected.
        </p>
      </div>
      <div className="footer-links" data-reveal>
        {socialLinks.map(([label, href, Icon, brand]) => (
          <a
            className={`social-${brand}`}
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Brooks School on ${label}`}
          >
            <span>
              <Icon />
            </span>
            {label}
          </a>
        ))}
      </div>
      <div className="footer-bottom">
        <span>Copyright {year} Brooks School</span>
        <span>Privacy Policy / Terms of Service</span>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
