import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "./TaskPage.css"

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

export function TaskPage(): React.JSX.Element {
    const params = useParams();
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate()

    const formatDate = (dateString: string | null) => {
        if (dateString === null) {
            return "Invalid date";
        }
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const [task, setTask] = useState<TaskType | null>(null);

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch(`http://195.133.197.53:8081/tasks/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                let result = await response.json()
                console.log(result)
                setTask(result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    return (
        <div className="task-container common">
            {<button onClick={() => navigate(-1)}>bach</button>}
            {task &&
                <div>
                    <h1>{task.categoryName}</h1>
                    <h3>{task.description}</h3>
                    <p>Начать {formatDate(task.startDate)}</p>
                    <p>Закончить {formatDate(task.endDate)}</p>
                    <h3>{task.description}</h3>
                </div>
            }
        </div>
    )
}
