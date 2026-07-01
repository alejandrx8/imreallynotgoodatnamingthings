import { useState, useEffect, useRef } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";

const CORRECT_ANSWER = "potatopotato849";

const RIDDLE_LINES = [
  "Start with something that grows underground.",
  "Repeat it.",
  "Finish with the numbers related to astronomy, the seasons, and nine cats' lives.",
  "",
  "What am I?!?",
];

function useTypingEffect(lines: string[], speed = 38) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let current: string[] = [];
    setDisplayed([]);
    setDone(false);

    const tick = () => {
      if (lineIdx >= lines.length) {
        setDone(true);
        return;
      }
      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        current = [...current.slice(0, lineIdx), line.slice(0, charIdx)];
        setDisplayed([...current]);
        charIdx++;
        setTimeout(tick, charIdx === 0 ? 400 : speed);
      } else {
        lineIdx++;
        charIdx = 0;
        current = [...current, ""];
        setTimeout(tick, 500);
      }
    };

    const initial = setTimeout(tick, 800);
    return () => clearTimeout(initial);
  }, []);

  return { displayed, done };
}

function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="particle" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

function RiddlePage() {
  const { displayed, done } = useTypingEffect(RIDDLE_LINES);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "correct">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === CORRECT_ANSWER) {
      setState("correct");
    } else {
      setState("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  useEffect(() => {
    if (done && inputRef.current) {
      inputRef.current.focus();
    }
  }, [done]);

  return (
    <div className="page">
      <Particles />

      <div className="fog fog-1" aria-hidden="true" />
      <div className="fog fog-2" aria-hidden="true" />

      <div className="container">
        <div className="candle-row" aria-hidden="true">
          <span className="candle" />
          <span className="candle" />
          <span className="candle" />
        </div>

        <header>
          <h1 className="title">
            <span className="skull">☽</span>
            &nbsp;The Enigma&nbsp;
            <span className="skull">☾</span>
          </h1>
          <div className="ornament" aria-hidden="true">✦ ✧ ✦</div>
        </header>

        <div className="scroll-card">
          <div className="riddle-text" aria-live="polite">
            {displayed.map((line, i) => (
              <p key={i} className={`riddle-line ${line === "" ? "spacer" : ""}`}>
                {line}
                {i === displayed.length - 1 && !done && (
                  <span className="cursor" aria-hidden="true">|</span>
                )}
              </p>
            ))}
          </div>

          {state !== "correct" && (
            <form
              className={`answer-form ${done ? "visible" : "hidden"} ${shake ? "shake" : ""}`}
              onSubmit={handleSubmit}
              aria-label="Answer the riddle"
            >
              <label className="answer-label" htmlFor="riddle-input">
                Speak your answer, if you dare…
              </label>
              <div className="input-row">
                <input
                  id="riddle-input"
                  ref={inputRef}
                  type="text"
                  className={`answer-input ${state === "wrong" ? "error" : ""}`}
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (state === "wrong") setState("idle");
                  }}
                  placeholder="Enter your answer…"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className="submit-btn">
                  &#x2192;
                </button>
              </div>
              {state === "wrong" && (
                <p className="feedback wrong" role="alert">
                  ✗ &nbsp;The shadows reject your answer. Try again.
                </p>
              )}
            </form>
          )}

          {state === "correct" && (
            <div className="success-card" role="status" aria-live="assertive">
              <div className="success-symbol">✦</div>
              <p className="success-title">You have pierced the veil.</p>
              <p className="success-sub">
                The answer was{" "}
                <span className="answer-reveal">{CORRECT_ANSWER}</span>
              </p>
            </div>
          )}
        </div>

        <footer className="footer">
          <span className="ornament">✦ ✧ ✦</span>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={RiddlePage} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
