import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const LAST_TEST_KEYS = {
  google: ["last-google-test", "last-test-google"],
  amazon: ["last-test-amazon"],
  microsoft: ["last-test-microsoft"],
  meta: ["last-test-meta"],
  apple: ["last-test-apple"],
  netflix: ["last-test-netflix"],
};

function resolveLastTestId(companyKey) {
  const keys = LAST_TEST_KEYS[companyKey] || [];
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return "";
}

export default function CompanyTestListPage({ companyKey, companyLabel }) {
  const navigate = useNavigate();
  const formattedTopic = (companyLabel || companyKey || "").toUpperCase();

  const tests = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: `${companyKey}-test-${i + 1}`,
        name: `${companyLabel} Coding Test_${i + 1}`,
        start: `${27 + i} Sep 25`,
        end: "31 May 28",
      })),
    [companyKey, companyLabel]
  );

  const [active, setActive] = useState(() => {
    const lastId = resolveLastTestId(companyKey);
    const found = tests.find((t) => t.id === lastId);
    return found || tests[0];
  });

  const key = `${companyKey}-progress-${active.id}`;
  const saved = JSON.parse(localStorage.getItem(key)) || {};
  const visitedCount = saved.visited ? Object.keys(saved.visited).length : 0;
  const percent = Math.round((visitedCount / 10) * 100);

  const handleStartTest = () => {
    navigate(`/practice/${companyKey}/${active.id}`);
  };

  return (
    <div className="company-list">
      <div className="company-sidebar">
        <input placeholder="Search" className="company-search" />

        <div className="company-header">
          <h2>{formattedTopic}_Practice</h2>
          <div className="company-header-progress">{percent}%</div>
        </div>

        {tests.map((test, i) => (
          <div
            key={test.id}
            onClick={() => setActive(test)}
            className={`company-test-item${active.id === test.id ? " active" : ""}`}
          >
            <p>{i + 1}. {test.name}</p>
            <p className="company-test-meta">Start : {test.start} | End : {test.end}</p>
          </div>
        ))}
      </div>

      <div className="company-content">
        <div className="company-topbar">
          <button onClick={() => navigate("/practice")} className="company-back">
            Back to Practice
          </button>

          <button
            onClick={handleStartTest}
            className={`company-action${percent > 0 ? " resume" : ""}`}
          >
            {percent > 0 ? "Resume Test" : "Start Test"}
          </button>
        </div>

        <div className="company-test-header">
          <h1 className="company-title">{active.name}</h1>
        </div>

        <div className="company-table">
          <table>
            <thead>
              <tr>
                <th className="company-cell">SNo</th>
                <th className="company-cell">Name</th>
                <th className="company-cell">Questions</th>
                <th className="company-cell">Duration</th>
                <th className="company-cell">Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="company-cell">1</td>
                <td className="company-cell">{companyLabel} Coding</td>
                <td className="company-cell">10</td>
                <td className="company-cell">Unlimited</td>
                <td className="company-cell">10</td>
              </tr>
              <tr className="company-total-row">
                <td className="company-cell"></td>
                <td className="company-cell">Total</td>
                <td className="company-cell">10</td>
                <td className="company-cell">Unlimited</td>
                <td className="company-cell">10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
