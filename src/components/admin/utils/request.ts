const BASE_URL = 'http://89.23.117.193/admin'


export const getClients = async () => {
    try {
        const response = await fetch(BASE_URL +'/clients');


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


export const getMasters = async (url: string) => {
    try {
        const token: string | null = localStorage.getItem("authToken");

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(BASE_URL + url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();


        // Проверяем структуру данных и возвращаем массив мастеров

        if (Array.isArray(data)) {
            return data; // Если это массив, возвращаем его
        } else if (data.content) {
            return data.content; // Если есть поле content, возвращаем его
        } else {
            throw new Error('Неизвестный формат данных'); // Обработка ошибки, если формат не совпадает
        }
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
