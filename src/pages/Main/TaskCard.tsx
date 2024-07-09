import {useNavigate} from "react-router-dom";

interface TaskType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    // customer: string,
    description: string;
    startDate: string;
    endDate: string
}

interface TaskCardProps {
    data: TaskType;
}

export function TaskCard({data}: TaskCardProps): React.JSX.Element {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const handleClick = () => {
        navigate("/task/" + data.categoryId);
    }

    return (
        <div className="task-card" onClick={handleClick}>
            <h3>{data.categoryName}</h3>
            <div className="text">
                <p>{data.description}</p>
                <span>Начать {formatDate(data.startDate)}</span>
            </div>
        </div>
    )
}