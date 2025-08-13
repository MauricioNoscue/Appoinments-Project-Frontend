export interface DoctorList {
    id: number,
    specialty: string,
    active: boolean,
    image: string,
    fullName: string | null,
    emailDoctor: string,
    isDeleted: boolean,
    registrationDate: Date
}