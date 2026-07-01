import { useState } from "react";

const CORRECT_ANSWER = "potatopotato849";

export default function App() {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === CORRECT_ANSWER) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div className="page">
      <div className="riddle">
        <p>Start with something that grows underground.</p>
        <p>Repeat it.</p>
        <p>Finish with the numbers related to astronomy, the seasons, and nine cats' lives.</p>
        <p className="question">What am I?!?</p>
      </div>

      {status !== "correct" ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (status === "wrong") setStatus("idle");
            }}
            placeholder="Your answer…"
            className={status === "wrong" ? "error" : ""}
            autoComplete="off"
            spellCheck={false}
          />
          {status === "wrong" && <p className="wrong">Wrong.</p>}
        </form>
      ) : (
        <p className="correct">Correct.</p>
      )}
    </div>
  );
}
