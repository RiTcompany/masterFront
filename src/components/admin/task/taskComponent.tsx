import {Pagination, Task} from "../interfaces/admin.props.ts";
import {deleteTaskRequest, getTasks} from "../utils/request.ts";
import React, {useEffect, useState} from "react";
import styles from "../Admin.module.css";
import styled from "../Admin.module.css";
const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]); // Хранение всех задач из content
    const [page, setPage] = useState(0); // Текущая страница
    const [totalPages, setTotalPages] = useState(1); // Всего страниц
    const [loading, setLoading] = useState(false); // Индикатор загрузки


    const fetchTasks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response: Pagination = await getTasks(pageNumber); // Получаем данные с сервера
            setTasks((prev) => [...prev, ...response.content]); // Добавляем новые задачи из content
            setTotalPages(response.totalPages); // Устанавливаем общее количество страниц
        } catch (error) {
            console.error("Ошибка при загрузке задач:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTasks(0);
    }, []);


    const loadMore = () => {
        if (page + 1 < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchTasks(nextPage);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const result = await deleteTaskRequest(id);
            if (result.response.ok) {
                setTasks((prevTasks) => {
                    const updatedTasks = prevTasks.filter((task) => task.id !== id); // Удаляем задачу из списка
                    console.log("Обновлённый список задач:", updatedTasks);
                    return updatedTasks;
                });
                console.log("Задача успешно удалена:", id);
            } else {
                console.error("Не удалось удалить задачу:", id);
            }
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
        }
    };


    return (
        <div>
            <h1 className={styles.adminTaskTitle}>Список задач</h1>
            <div className={styles.adminTaskContainer}>
                {tasks.map((task) => (
                    <div key={task.id} className={styles.adminTaskBlock}>
                        <div className={styles.adminTaskBlockFlex}>
                            <h2>{task.description}</h2>
                            <p>
                                Дата начала: {new Date(task.startDate).toLocaleDateString()} - Дата окончания:{" "}
                                {new Date(task.endDate).toLocaleDateString()}
                            </p>
                            <div className={styles.adminTaskBlockData}>
                                <span>Категория:</span>
                                <span>{task.categoryName}</span>
                            </div>
                            <div className={styles.adminTaskBlockData}>
                                <span>Клиент:</span>
                                <span>{task.userName} ({task.clientEmail})</span>
                            </div>
                            <div onClick={() => deleteTask(task.id)} className={styled.deleteButton}>
                                Удалить
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {page + 1 < totalPages && (
                <button
                    onClick={loadMore}
                    disabled={loading}
                    className={styles.adminTaskLoadMore}
                >
                    {loading ? "Загрузка..." : "Загрузить ещё"}
                </button>
            )}
        </div>
    );
};

export default TaskList;