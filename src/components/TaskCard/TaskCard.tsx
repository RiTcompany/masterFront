import {useNavigate} from "react-router-dom";
import ("./TaskCard.css")

interface TaskType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string
}

interface TaskCardProps {
    data: TaskType;
}

export function TaskCard({data}: TaskCardProps): React.JSX.Element {
    const token = localStorage.getItem("authToken")
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const handleClick = () => {
        if (token) {
            navigate("/task/" + data.id);
        } else{
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }
    }

    return (
        <div className="task-card" onClick={handleClick}>
            <h3>{data.categoryName}</h3>
            <h3>{data.userName}</h3>
            <div className="text">
                <p>{data.description}</p>
                <span>Начать {formatDate(data.startDate)}</span>
            </div>
        </div>
    )
}
