import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function HistoryPage() {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [problemRes, attemptsRes] = await Promise.all([
                    api.getProblem(problemId),
                    api.getAttemptHistory(problemId)
                ]);

                setProblem(problemRes.data);
                setAttempts(attemptsRes.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [problemId]);

    if (loading) {
        return (
            <div className="app-shell">
                <div className="state-box loading-state">
                    <div className="spinner" />
                    Loading history...
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="brand-mark">L</div>
                    <div>
                        <strong>LLD Practice</strong>
                        <span>Design better systems.</span>
                    </div>
                </div>

                <div className="topbar-actions">
                    <button
                        className="primary-btn"
                        onClick={() => navigate(`/practice/${problemId}`)}
                    >
                        New Attempt →
                    </button>

                    <button
                        className="back-btn"
                        onClick={() => navigate('/')}
                    >
                        ← Problems
                    </button>
                </div>
            </header>

            <main className="history-container fade-in">
                <section className="history-hero">
                    <span className="eyebrow">ATTEMPT HISTORY</span>
                    <h1>{problem?.title || problemId}</h1>
                    <p>{problem?.description}</p>
                </section>

                {error && (
                    <div className="state-box error">
                        {error}
                    </div>
                )}

                {attempts.length === 0 && !error && (
                    <div className="state-box">
                        <p>No attempts yet for this problem.</p>
                        <button
                            className="primary-btn"
                            style={{ marginTop: '16px' }}
                            onClick={() => navigate(`/practice/${problemId}`)}
                        >
                            Start Your First Attempt →
                        </button>
                    </div>
                )}

                {attempts.length > 0 && (
                    <div className="history-list">
                        {attempts.map((attempt, index) => {
                            const score = attempt.evaluation?.overallScore ?? null;
                            const scoreClass =
                                score === null ? '' :
                                score >= 75 ? 'score-high' :
                                score >= 50 ? 'score-mid' :
                                'score-low';

                            const statusClass = attempt.status?.toLowerCase() || '';

                            return (
                                <article
                                    className="history-card"
                                    key={attempt.id}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="history-card-left">
                                        <div className="history-card-header">
                                            <span className={`status-badge ${statusClass}`}>
                                                {attempt.status}
                                            </span>
                                            <span className="history-date">
                                                {formatDate(attempt.createdAt)}
                                            </span>
                                        </div>

                                        <h3>Attempt #{attempts.length - index}</h3>

                                        {attempt.completedAt && (
                                            <p className="history-meta">
                                                Completed {formatDate(attempt.completedAt)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="history-card-right">
                                        {score !== null && (
                                            <div className={`history-score ${scoreClass}`}>
                                                <strong>{score}</strong>
                                                <small>/100</small>
                                            </div>
                                        )}

                                        {attempt.status === 'COMPLETED' && (
                                            <button
                                                className="secondary-btn"
                                                onClick={() => navigate(`/result/${attempt.id}`)}
                                            >
                                                View Result
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <div className="result-actions">
                    <button
                        className="secondary-btn"
                        onClick={() => navigate('/')}
                    >
                        Back to Problems
                    </button>

                    <button
                        className="primary-btn"
                        onClick={() => navigate(`/practice/${problemId}`)}
                    >
                        New Attempt →
                    </button>
                </div>
            </main>
        </div>
    );
}

function formatDate(dateString) {
    if (!dateString) return '—';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '—';
    }
}
