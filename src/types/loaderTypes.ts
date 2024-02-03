export type ProfileLoaderData = {
    // message: string;
    // userData: {
    //     comments: Comments[];
    //     created_at: string;
    //     email: string;
    //     id: number;
    //     name: string;
    //     posts: Post[];
    //     role: string;
    //     updated_at: string;
    // }
    // userUploads: File[];
    userDataResponse: UserDataResponse;
    likesResponse: LikesResponse;
}

export type HomeLoaderData = {
    // comments: Comments[];
    // posts: Post[]
    // likes: Likes[];
    postsResponse: PostsResponse,
    likesResponse: LikesResponse
}

export type UserDataResponse = {
    message: string;
    userData: UserData;
    userUploads: File[];
}

export type PostsResponse = {
    posts: Post[];
    comments: Comment[];
}

export type LikesResponse = {
    likes: Likes[]
}

export type UserData = {
    comments: Comments[];
    created_at: string;
    email: string;
    id: number;
    name: string;
    posts: Post[];
    role: string;
    updated_at: string;
} 

export type Post = {
    comments: Comments[] | undefined;
    created_at: string;
    file: File;
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
    post_id: string | undefined;
    uploaded_at: string;
    user_id: number;
}

export type Likes = {
    created_at: string;
    id: number;
    post_id: number;
    updated_at: string;
    user_id: number;
}

//============Form Types==============//
export type CommentFormValues = {
    text: string;
};

