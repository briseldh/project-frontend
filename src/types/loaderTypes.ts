export type ProfileLoaderData = {
    userDataResponse: Promise<UserDataResponse>;
    likesResponse: Promise<LikesResponse>;

}

export type HomeLoaderData = {
    postsResponse: Promise<PostsResponse>,
}

export type UserDataResponse = {
    message: string;
    userData: UserData;
    userUploads: File[];
    comments: Comments[];
    allProfilePics: ProfilePic[];
}

export type PostsResponse = {
    posts: Post[];
    comments: Comments[];
    allLikes: Likes[];
    allProfilePics: ProfilePic[];
}

export type LikesResponse = {
    likes: Likes[],
    allLikes: Likes[];

}

export type UserData = {
    comments: Comments[];
    created_at: string;
    email: string;
    id: number;
    name: string;
    posts: Post[];
    profile_pic: ProfilePic;
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
    user_id: number;
}

export type Comments = {
    created_at: string;
    id: number;
    post_id: number;
    text: string;
    updated_at: string;
    user?: UserData
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

export type ProfilePic = {
    alt_text: string;
    created_at: string;
    id: number;
    path: string;
    updated_at: string;
    user_id: number;
} | undefined;

export type Likes = {
    created_at: string;
    id: number;
    post_id: number;
    updated_at: string;
    user_id: number;
}

