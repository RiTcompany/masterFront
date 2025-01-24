const BASE_URL = 'https://spb-masters.ru/admin'
const URL_DEFAULT  ="https://spb-masters.ru"


export const getClients = async (page:number) => {
    try {
        const response = await fetch(BASE_URL +`/clients?=page=${page}`);


        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

export const responseGetDocument = async (id: number) => {
    try {
        const url = new URL(URL_DEFAULT + `/masters/show/${id}`);

        const response = await fetch(url.toString(), {
            method: 'GET',
        });


        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }


        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        return pdfUrl;
    } catch (error) {
        console.error('Ошибка при получении документа:', error);
        throw error;
    }
};



export const responseAddComment = async (id: number, comment: string) => {
    try {
        const url = new URL(URL_DEFAULT + `/masters/${id}/verification-comment`);
        url.searchParams.append('comment', comment);  // Добавляем comment как query-параметр

        const response = await fetch(url.toString(), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};



export const getMasters = async (url: string, page:number) => {
    try {
    //    const token: string | null = localStorage.getItem("authToken");

        const headers = {
    //        "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(BASE_URL + url + `?=page=${page}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();




        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};


export const postMaster = async (url: string) => {
    try {
        const token: string | null = localStorage.getItem("authToken");

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };


        const fullUrl = `${BASE_URL + url}`;

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

export const deleteMaster = async (url: string) => {
    try {
        const token: string | null = localStorage.getItem("authToken");

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };


        const fullUrl =`${BASE_URL + url}`;

        const response = await fetch(fullUrl, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }


        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting master:', error);
        throw error;
    }
};


export const requestBlockUser = async (username: string, isBanned: boolean) => {
    try {
        const response = await fetch(`${BASE_URL}/ban-user?username=${username}&isBanned=${isBanned}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to ban/unban user. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


export const getTasks = async (page: number) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        const fullUrl = `${URL_DEFAULT}/tasks?page=${page}`;

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
        throw error;
    }
};


export const deleteTaskRequest = async (id: number) => {
    try {


        const fullUrl = `${URL_DEFAULT}/tasks/${id}`;
        const token: string | null = localStorage.getItem("authToken");


        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };


        const response = await fetch(fullUrl, {
            headers: headers,
            method: 'DELETE',

        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return {data, response};
    } catch (error) {
        console.error('Error deleting master:', error);
        throw error;
    }
};