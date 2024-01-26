export type ProfileLoaderData = {
    message: string;
    userData: {
        comments: Comments[];
        created_at: string;
        email: string;
        id: number;
        name: string;
        posts: Post[];
        role: string;
        updated_at: string;
    }
    userUploads: File[];
}

export type Post = {
    created_at: string;
    id: number;
    text: string;
    title: string;
    updated_at: string;
    user_id: string;
}

export type Comments = {
    created_at: string;
    id: number;
    post_id: number;
    text: string;
    updated_at: string;
    user_id: number;
}

export type File = {
    alt_text: string;
    id: number;
    path: string;
    post_id: number;
    uploaded_at: string;
    user_id: number;
}