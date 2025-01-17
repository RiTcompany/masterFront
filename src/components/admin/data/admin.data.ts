import {AdminPanelProps} from "../interfaces/admin.props.ts";

export  const  HeaderData :AdminPanelProps[] = [
    {
        id:2,
        name:"Исполнители",
        link:"/admin/masters"
    },
    {
        id:3,
        name:"Заказчики",
        link:"/admin/clients"
    },
    {
        id:4,
        name:"Объявления",
        link:"/admin/tasks"
    }
    ]