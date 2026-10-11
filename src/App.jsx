import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./Auth";
import { supabase } from "./lib/supabase";

const navigation = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Study Notes", icon: "▤" },
  { name: "Quiz", icon: "☑" },
  { name: "Flashcards", icon: "▧" },
  { name: "AI Tutor", icon: "✦" },
  { name: "Study History", icon: "◷" },
];

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activePage, setActivePage] = useState("Dashboard");
  const [studyText, setStudyText] = useState("");

    useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Could not retrieve session:", error.message);
      }

      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }
  }

  function renderPage() {
    switch (activePage) {
      case "Study Notes":
        return (
          <section className="panel">
            <span className="eyebrow">AI LEARNING SPACE</span>
            <h2>Turn your material into smart notes</h2>
            <p>
              Paste your study material here. AI note generation will be
              connected on Day 3.
            </p>
            <label htmlFor="studyText">Your study material</label>
            <textarea
              id="studyText"
              value={studyText}
              onChange={(event) => setStudyText(event.target.value)}
              placeholder="Paste your textbook notes, class notes, or study material here..."
              rows={8}
            />
            <button
              className="primary-button"
              onClick={() =>
                alert("The AI generation feature will be added on Day 3!")
              }
            >
              ✦ Generate Notes
            </button>
          </section>
        );

      case "Quiz":
        return (
          <section className="panel">
            <span className="eyebrow">TEST YOUR KNOWLEDGE</span>
            <h2>Ready for a quick challenge?</h2>
            <p>
              Generate MCQs from your study material, check your score,
              and learn from explanations.
            </p>
            <div className="placeholder-box">📝 Your quizzes will appear here.</div>
          </section>
        );

      case "Flashcards":
        return (
          <section className="panel">
            <span className="eyebrow">REMEMBER MORE</span>
            <h2>Your flashcard collection</h2>
            <p>Revise definitions and important concepts with flashcards.</p>
            <div className="placeholder-box">🗂️ Your flashcards will appear here.</div>
          </section>
        );

      case "AI Tutor":
        return (
          <section className="panel">
            <span className="eyebrow">YOUR PERSONAL STUDY BUDDY</span>
            <h2>Ask. Understand. Learn.</h2>
            <p>
              Ask questions about your study material and get explanations
              from your AI tutor.
            </p>
            <div className="placeholder-box">✦ Your AI tutor will be added on Day 5.</div>
          </section>
        );

      case "Study History":
        return (
          <section className="panel">
            <span className="eyebrow">YOUR PROGRESS</span>
            <h2>Every study session counts</h2>
            <p>
              Your saved notes, quiz results, and previous sessions
              will be available here.
            </p>
            <div className="placeholder-box">
              ◷ Your study history will be added on Day 6.
            </div>
          </section>
        );

      default:
        return (
          <>
            <section className="welcome-card">
              <div>
                <span className="eyebrow">YOUR PERSONAL AI STUDY SPACE</span>
                <h2>Learn smarter, not harder. ✨</h2>
                <p>
                  Turn your study material into notes, quizzes, and
                  flashcards—all in one place.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setActivePage("Study Notes")}
                >
                  Start studying <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="welcome-art" aria-hidden="true">📚</div>
            </section>

            <div className="section-heading">
              <div>
                <h2>Your learning toolkit</h2>
                <p>Everything you need to study effectively.</p>
              </div>
            </div>

            <div className="feature-grid">
              <button
                className="feature-card"
                onClick={() => setActivePage("Study Notes")}
              >
                <span className="feature-icon lilac">✦</span>
                <h3>AI Study Notes</h3>
                <p>Summaries, key points, and definitions.</p>
                <span className="card-link">Create notes →</span>
              </button>

              <button
                className="feature-card"
                onClick={() => setActivePage("Quiz")}
              >
                <span className="feature-icon peach">☑</span>
                <h3>Quick Quiz</h3>
                <p>Practice MCQs and check your understanding.</p>
                <span className="card-link">Take a quiz →</span>
              </button>

              <button
                className="feature-card"
                onClick={() => setActivePage("Flashcards")}
              >
                <span className="feature-icon mint">▧</span>
                <h3>Flashcards</h3>
                <p>Revise concepts one card at a time.</p>
                <span className="card-link">Start revising →</span>
              </button>

              <button
                className="feature-card"
                onClick={() => setActivePage("AI Tutor")}
              >
                <span className="feature-icon blue">✧</span>
                <h3>AI Tutor</h3>
                <p>Get help understanding difficult topics.</p>
                <span className="card-link">Ask a question →</span>
              </button>
            </div>

            <section className="bottom-tip">
              <span className="tip-icon">💡</span>
              <div>
                <h3>A little progress every day</h3>
                <p>
                  Start with one topic, practise what you learn, and
                  keep building your knowledge.
                </p>
              </div>
            </section>
          </>
        );
    }
  }

    if (authLoading) {
    return <div className="auth-page">Loading StudySpark AI...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">S✦</div>
          <div>
            <h1>StudySpark</h1>
            <span>AI LEARNING COMPANION</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "AI Tutor" && (
                <span className="new-label">NEW</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="study-reminder">
            <span>🌷</span>
            <h3>You've got this!</h3>
            <p>Small steps lead to big achievements.</p>
          </div>
          <p className="sidebar-footer">Made for curious minds ♡</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {activePage}</p>
            <h2>{activePage}</h2>
          </div>
                    <div className="user-profile">
            <span className="user-email">
              {session.user.email}
            </span>
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <div className="page-content">{renderPage()}</div>

        <footer className="page-footer">
          StudySpark AI · Your learning journey, one step at a time.
        </footer>
      </main>
    </div>
  );
}

export default App;