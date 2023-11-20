
export interface Course {
    name: string;
    school: string;
    year: number;
    isDone?: boolean 
}

export interface Technology {
    name: string;
    hasCertify: boolean;
    hasCourse: boolean;
    courses?: Course[];
    description: string;
    index: number;
    imageUrl: string;
}