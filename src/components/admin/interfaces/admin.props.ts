

export interface  AdminPanelProps {
    id:number;
    name:string;
    link:string;
}



export interface AdminResponseClient {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Client[];
    number: number;
    sort: Sort;
    pageable: Pageable;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}


export interface Client {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    telegramTag: string | null;
    userId: User;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    password: string;
    role: string;
    isBanned:boolean;
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}


export interface Authority {
    authority: string;
}


export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}


export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

//Мастер

export interface Master {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    metroStation: string[] | MetroStation[];
    email: string;
    phoneNumber: string;
    description: string;
    categories:string[] | CategoryMaster[];
    age: number;
    rate: number;
    userId:User;
}

export interface MetroStation {
    id: number;
    name: string;
}

export interface CategoryMaster {
    id: number;
    name: string;
}

export interface MasterResponse {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Master[];
}


export interface SvgComponentProps {
    num: number;
}





export  interface MasterItemProps {
    item: Master;
    url :string;
    onUpdate: () => void;

}


export interface Pagination {
    content: Task[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
    };
    size: number;
    totalElements: number;
    totalPages: number;
}


export interface Task {
    id: number;
    description: string;
    startDate: string;
    endDate: string;
    rate: number | null;
    categoryId: number;
    categoryName: string;
    clientEmail: string;
    clientPhoneNumber: string;
    clientTelegramTag: string;
    isCompleted: boolean;
    feedback: string | null;
    masterEmail: string | null;
    masterId: number | null;
    masterName: string;
    masterPhoneNumber: string | null;
    masterTelegramTag: string | null;
    maxPrice: number | null;
    userId: number;
    userName: string;
}