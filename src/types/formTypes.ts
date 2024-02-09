export type LoginFormValues = {
    email: string;
    password: string;
}

export type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
}

export type CommentFormValues = {
    text: string;
};

export type ProfilePicFormValues = {
    avatar: FileList;
}

export type PostFormValues = {
    title: string;
    avatar: FileList;
    text: string;
}
