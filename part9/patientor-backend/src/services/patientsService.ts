import patientsData from '../../data/patients';
import { Patient, PublicPatient } from '../types';

const patients: Patient[] = patientsData;

const getPatientsPublic = (): PublicPatient[] => {
    return patients.map(({name, id, dateOfBirth, gender, occupation}) => ({
        name, 
        id, 
        dateOfBirth, 
        gender, 
        occupation
    }));
};

export default {
    getPatientsPublic,
};
