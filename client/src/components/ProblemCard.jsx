import { useNavigate } from 'react-router-dom';

function ProblemCard({ problem }) {
    const navigate = useNavigate();

    return (
        <div className="problem-card">
            <div className="problem-card-top">
                <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                </span>
            </div>

            <h2>{problem.title}</h2>

            <p>{problem.description}</p>

            <div className="requirements">
                <strong>What you'll practice</strong>

                <ul>
                    {problem.requirements?.slice(0, 3).map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                    ))}
                </ul>
            </div>

            <button
                className="primary-btn"
                onClick={() => navigate(`/practice/${problem.id}`)}
            >
                Start Practice →
            </button>
        </div>
    );
}

export default ProblemCard;