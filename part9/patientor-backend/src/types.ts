type Diagnose = { 
    code: string;
    name: string;
    latin?: string;
};

type Patient = {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
};

type PublicPatient = Omit<Patient, 'ssn'>;

export type { Diagnose, Patient, PublicPatient };
