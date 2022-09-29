export type NewUser = {
    name:String;
    password:String;
    newName:String;
    newPassword:String;
};
export type authUser = {
    name:String;
    password:String;
};
export type User = {
    id?: number;
    name:String;
    email:String;
    password:String;
};
