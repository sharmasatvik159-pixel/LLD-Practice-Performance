import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function ResultPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getAttempt(attemptId)
            .then((response) => {
                setAttempt(response.data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [attemptId]);

    if (loading) {
        return (
            <div className="app-shell">
                <div className="state-box loading-state">
                    <div className="spinner" />
                    Loading evaluation...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-shell">
                <div className="state-box error">
                    {error}
                </div>
            </div>
        );
    }

    const evaluation =
        attempt?.evaluation ||
        attempt?.evaluationResult;

    const score = evaluation?.overallScore ?? 0;

    const feedback =
        evaluation?.feedbackItems ||
        evaluation?.feedback ||
        [];

    const scoreClass =
        score >= 75 ? 'score-high' :
        score >= 50 ? 'score-mid' :
        'score-low';

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

                <button
                    className="back-btn"
                    onClick={() => navigate('/')}
                >
                    ← All Problems
                </button>
            </header>

            <main className="result-container fade-in">
                <section className="result-hero">
                    <div>
                        <span className="eyebrow">
                            EVALUATION COMPLETE
                        </span>

                        <h1>
                            Your design has been reviewed.
                        </h1>

                        <p>
                            Here's your structured LLD feedback
                            across 8 rubric criteria.
                        </p>
                    </div>

                    <div className={`score-card ${scoreClass}`}>
                        <span>OVERALL SCORE</span>
                        <strong>{score}</strong>
                        <small>/ 100</small>
                    </div>
                </section>

                <section className="feedback-section">
                    <div className="section-heading">
                        <div>
                            <span className="eyebrow">FEEDBACK</span>
                            <h2>Design review</h2>
                        </div>

                        <span className="evaluator">
                            {evaluation?.evaluatorType || 'RULE_BASED'}
                        </span>
                    </div>

                    <div className="feedback-list">
                        {feedback.map((item, index) => {
                            const itemScoreClass =
                                item.score >= 7 ? 'score-high' :
                                item.score >= 5 ? 'score-mid' :
                                'score-low';

                            return (
                                <article
                                    className="feedback-card"
                                    key={item.criterionId || index}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <div className="feedback-top">
                                        <div>
                                            <span className="feedback-index">
                                                CRITERION {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <h3>
                                                {formatName(item.criterionId)}
                                            </h3>
                                        </div>

                                        <div className={`criterion-score ${itemScoreClass}`}>
                                            {item.score}
                                            <span>/10</span>
                                        </div>
                                    </div>

                                    <div className="feedback-grid">
                                        <FeedbackDetail
                                            title="Evidence"
                                            text={item.evidence}
                                        />

                                        <FeedbackDetail
                                            title="Concern"
                                            text={item.concern}
                                        />

                                        <FeedbackDetail
                                            title="Suggestion"
                                            text={item.suggestion}
                                        />

                                        <FeedbackDetail
                                            title="Confidence"
                                            text={item.confidence}
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <div className="result-actions">
                    <button
                        className="secondary-btn"
                        onClick={() => navigate(`/history/${attempt?.problemId}`)}
                    >
                        View History
                    </button>

                    <button
                        className="primary-btn"
                        onClick={() => navigate(`/practice/${attempt?.problemId}`)}
                    >
                        Try Again →
                    </button>
                </div>
            </main>
        </div>
    );
}

function FeedbackDetail({ title, text }) {
    return (
        <div className="feedback-part">
            <span>{title}</span>
            <p>{text || '—'}</p>
        </div>
    );
}

function formatName(value = '') {
    return value
        .replaceAll('_', ' ')
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}