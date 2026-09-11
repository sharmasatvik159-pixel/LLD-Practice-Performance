import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function PracticePage() {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [evaluatorType, setEvaluatorType] = useState('RULE_BASED');

    const [form, setForm] = useState({
        requirements: '',
        assumptions: '',
        classes: '',
        responsibilities: '',
        relationships: '',
        designDecisions: '',
        edgeCases: ''
    });

    useEffect(() => {
        async function start() {
            try {
                const problemResponse = await api.getProblem(problemId);
                setProblem(problemResponse.data);

                const attemptResponse = await api.startAttempt(problemId);

                const id =
                    attemptResponse.data?.id ||
                    attemptResponse.data?.attemptId;

                setAttemptId(id);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        start();
    }, [problemId]);

    function update(field, value) {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));
    }

    async function submit(event) {
        event.preventDefault();

        if (!attemptId) {
            setError('No attempt was created.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await api.submitAttempt(attemptId, {
                ...form,
                evaluatorType
            });

            navigate(`/result/${attemptId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="app-shell">
                <div className="state-box loading-state">
                    <div className="spinner" />
                    Preparing practice session...
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
                        className="back-btn"
                        onClick={() => navigate(`/history/${problemId}`)}
                    >
                        History
                    </button>

                    <button
                        className="back-btn"
                        onClick={() => navigate('/')}
                    >
                        ← Problems
                    </button>
                </div>
            </header>

            <main className="practice-layout">
                <aside className="problem-sidebar">
                    <span className="eyebrow">CURRENT PROBLEM</span>

                    <h1>{problem?.title}</h1>

                    <span className={`difficulty ${problem?.difficulty?.toLowerCase()}`}>
                        {problem?.difficulty}
                    </span>

                    <p className="problem-description">
                        {problem?.description}
                    </p>

                    <div className="sidebar-section">
                        <h3>Requirements</h3>

                        <ul>
                            {(problem?.requirements || []).map(
                                (item, index) => (
                                    <li key={index}>{item}</li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="tip-box">
                        <strong>Design tip</strong>
                        <p>
                            Focus on responsibilities, relationships,
                            abstraction and extensibility.
                        </p>
                    </div>
                </aside>

                <section className="practice-content">
                    <div className="practice-heading">
                        <div>
                            <span className="eyebrow">YOUR DESIGN</span>
                            <h2>Explain your solution</h2>
                        </div>
                    </div>

                    <form onSubmit={submit}>

                        <div className="evaluator-selector">
                            <span className="eyebrow">EVALUATOR ENGINE</span>
                            <div className="evaluator-options">
                                <button
                                    type="button"
                                    className={`eval-pill ${evaluatorType === 'RULE_BASED' ? 'active' : ''}`}
                                    onClick={() => setEvaluatorType('RULE_BASED')}
                                >
                                    <span className="eval-pill-title">Rule-Based Evaluator</span>
                                    <span className="eval-pill-sub">Fast rubric compliance scoring</span>
                                </button>

                                <button
                                    type="button"
                                    className={`eval-pill ${evaluatorType === 'AI' ? 'active' : ''}`}
                                    onClick={() => setEvaluatorType('AI')}
                                >
                                    <span className="eval-pill-title">AI Evaluator</span>
                                    <span className="eval-pill-sub">Heuristic architectural review</span>
                                </button>
                            </div>
                        </div>

                        <Field
                            number="01"
                            title="Requirement Understanding"
                            description="Describe what the system must do."
                            value={form.requirements}
                            onChange={(value) => update('requirements', value)}
                            placeholder="Explain the main functional requirements..."
                        />

                        <Field
                            number="02"
                            title="Assumptions"
                            description="Mention assumptions that simplify the design."
                            value={form.assumptions}
                            onChange={(value) => update('assumptions', value)}
                            placeholder="List important assumptions..."
                        />

                        <Field
                            number="03"
                            title="Classes"
                            description="List the major classes/entities."
                            value={form.classes}
                            onChange={(value) => update('classes', value)}
                            placeholder="Example: ParkingLot, Vehicle, ParkingSpot..."
                        />

                        <Field
                            number="04"
                            title="Class Responsibilities"
                            description="Explain what each class does."
                            value={form.responsibilities}
                            onChange={(value) => update('responsibilities', value)}
                            placeholder="Explain the responsibility of each class..."
                        />

                        <Field
                            number="05"
                            title="Relationships"
                            description="Explain how your classes interact."
                            value={form.relationships}
                            onChange={(value) => update('relationships', value)}
                            placeholder="Describe associations, composition, inheritance..."
                        />

                        <Field
                            number="06"
                            title="Design Decisions"
                            description="Mention interfaces, abstraction or patterns."
                            value={form.designDecisions}
                            onChange={(value) => update('designDecisions', value)}
                            placeholder="Explain your important design decisions..."
                        />

                        <Field
                            number="07"
                            title="Edge Cases & Testability"
                            description="Think about unusual situations and testing."
                            value={form.edgeCases}
                            onChange={(value) => update('edgeCases', value)}
                            placeholder="List edge cases and how you would test them..."
                        />

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        <div className="submit-area">
                            <div>
                                <strong>Ready to submit?</strong>
                                <p>
                                    Your design will be evaluated against the LLD rubric.
                                </p>
                            </div>

                            <button
                                className="primary-btn submit-btn"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Evaluating...'
                                    : 'Submit Design →'}
                            </button>
                        </div>

                    </form>
                </section>
            </main>
        </div>
    );
}

function Field({
    number,
    title,
    description,
    value,
    onChange,
    placeholder
}) {
    return (
        <div className="design-field">
            <div className="field-heading">
                <span className="field-number">{number}</span>

                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}