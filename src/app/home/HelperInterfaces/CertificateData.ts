export  interface Subject{
    name : string;
    marks : string;     
    gp : string;
}
// performance  => cgpa !=  blank => use gp; => else : use "%". 
export  interface Subjects{
    subjects : Subject[];
    uri : string; 
    certificateOf : string;
}