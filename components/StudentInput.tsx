
import React from 'react';
import type { StudentData } from '../types';

interface StudentInputProps {
    student: StudentData;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StudentInput: React.FC<StudentInputProps> = ({ student, onFileChange }) => {
    const inputId = `studentFile-${student.name.replace(/\s+/g, '-')}`;

    return (
        <div className="w-full md:w-2/5 text-center flex flex-col items-center space-y-3">
            <img 
                src={student.imgPreview} 
                alt={`${student.name} Preview`} 
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
            />
            <p className="font-semibold text-xl text-gray-700 h-8 flex items-center justify-center capitalize">
                {student.name}
            </p>
            <label htmlFor={inputId} className="cursor-pointer inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium transition hover:bg-gray-200">
                Upload Photo
            </label>
            <input 
                type="file" 
                id={inputId} 
                className="hidden" 
                accept="image/*"
                onChange={onFileChange}
            />
        </div>
    );
};

export default StudentInput;
