import {create} from "zustand";

const usePostStore = create((set)=>({
    posts: [],
    createPost: (post)=> set(state=>({posts:[post,...state.posts]})),
    //delete post
    deletePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),

    
    setPosts: (posts)=>set({posts}),

    addComment: (postId, comment) =>
		set((state) => ({                             // we r searching evevry post once we find desired post, add commnet doc to it
			posts: state.posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: [...post.comments, comment],
					};
				}
				return post;
			}),
		})),
}))

export default usePostStore;