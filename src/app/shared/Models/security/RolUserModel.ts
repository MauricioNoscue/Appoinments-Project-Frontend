export interface RolUserList {
    rolId: number,
    userId: number,
    rolName: string,
    email: string,
    id: number,
    isDeleted: boolean,
    registrationDate: string
}

export interface RolUserCreated {
    rolId: number,
    userId: number
}