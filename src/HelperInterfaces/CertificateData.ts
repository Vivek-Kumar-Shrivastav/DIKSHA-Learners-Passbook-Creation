export  interface Subject{
    name : string;
    marksObtained : string; 
    totalMarks : string;    
    gp : string;
}
// performance  => cgpa !=  blank => use gp; => else : use "%". 
export interface Certificate{  // can be renamed to Certificate
    subjects : Subject[];
    uri : string; 
    certificateOf : string;
    rollNumber: string;
}