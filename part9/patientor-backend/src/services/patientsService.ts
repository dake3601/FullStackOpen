import patientsData from '../../data/patients';
import { NewPatient, Patient, PublicPatient } from '../types';
import { v1 as uuid } from 'uuid';

const patients = patientsData as Patient[];

const getPatientsPublic = (): PublicPatient[] => {
    return patients.map(({ name, id, dateOfBirth, gender, occupation }) => ({
        name,
        id,
        dateOfBirth,
        gender,
        occupation
    }));
};

const addPatient = (patient: NewPatient): Patient => {
    const id: string = uuid();
    const newPatient = {
        id,
        ...patient
    };
    patients.push(newPatient);
    return newPatient;
};

export default {
    getPatientsPublic,
    addPatient
};
