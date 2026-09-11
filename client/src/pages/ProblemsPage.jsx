import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ProblemsPage() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getProblems()
            .then((response) => {
                setProblems(response.data || []);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand">
                    <div className="brand-mark">L</div>
                    <div>
                        <strong>LLD Practice</strong>
                        <span>Design better systems.</span>
                    </div>
                </div>
            </header>

            <main className="container fade-in">
                <section className="hero">
                    <span className="eyebrow">SYSTEM DESIGN PRACTICE</span>

                    <h1>
                        Think in systems.
                        <br />
                        <span>Design with intent.</span>
                    </h1>

                    <p>
                        Practice Low-Level Design problems, explain your decisions,
                        and receive structured feedback on your design.
                    </p>
                </section>

                <div className="section-heading">
                    <div>
                        <span className="eyebrow">PROBLEMS</span>
                        <h2>Choose a challenge</h2>
                    </div>

                    <span className="problem-count">
                        {problems.length} problems
                    </span>
                </div>

                {loading && (
                    <div className="state-box loading-state">
                        <div className="spinner" />
                        Loading problems...
                    </div>
                )}

                {error && (
                    <div className="state-box error">
                        Backend error: {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="problem-grid">
                        {problems.map((problem) => (
                            <div className="problem-card" key={problem.id}>
                                <span className={`difficulty ${problem.difficulty?.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>

                                <h2>{problem.title}</h2>

                                <p>{problem.description}</p>

                                <div className="requirements">
                                    <strong>Requirements</strong>

                                    <ul>
                                        {(problem.requirements || []).slice(0, 3).map(
                                            (requirement, index) => (
                                                <li key={index}>{requirement}</li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div className="card-actions">
                                    <button
                                        className="primary-btn"
                                        onClick={() => navigate(`/practice/${problem.id}`)}
                                    >
                                        Start Practice →
                                    </button>

                                    <button
                                        className="secondary-btn"
                                        onClick={() => navigate(`/history/${problem.id}`)}
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}