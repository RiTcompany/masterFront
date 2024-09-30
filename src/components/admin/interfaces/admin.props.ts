

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
    user: User;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    password: string;
    role: string;
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
