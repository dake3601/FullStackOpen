type Diagnose = {
    code: string;
    name: string;
    latin?: string;
};

enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

type Patient = {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
};

type PublicPatient = Omit<Patient, 'ssn'>;
type NewPatient = Omit<Patient, 'id'>;

export { Gender };
export type { Diagnose, Patient, PublicPatient, NewPatient };
