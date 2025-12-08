"use client";

import { addComment, deleteUserPost, getAllUserPosts, loadSinglePostDetails, viewOtherUserPosts } from '@/services/userService';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useLoading } from '@/app/(user)/template';
import { Heart, MessageCircle, X, User, Trash } from 'lucide-react'

interface Comment {
    _id: string
    pfp?: string
    userName: string
    createdAt: string
    comment: string
}

interface Post {
    _id: string
    pfp?: string
    userName: string
    text?: string
    image?: string
    title?: string
    createdAt: string
    likes: number
    likedBy: string[]
    comments: Comment[]
}

interface Props {
    params:{
        id:string
    }
}

interface SinglePostUserDetails {
    pfp?: string
    name: string
}

function MyPosts({params}: Props) {
    const {id}=params
    const setLoading=useLoading()
    const [posts, setPosts]=useState<Post[] | null>(null)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [singlePostUserDetails, setSinglePostUserDetails]=useState<SinglePostUserDetails | null>(null)
    const [newComment, setNewComment] = useState('')
    const [userId, setUserId]=useState<string | null>(null)

    useEffect(()=>{
        getUserPost()
    }, [])

    const getUserPost = async () => {
        const result=await viewOtherUserPosts(id)
        setPosts(result.result)
    }

    const fetchUserId=async()=>{
        try {
        const res=await fetch('/api/me')
        const data=await res.json()
        setUserId(data.userId)
        } catch (error) {
        console.log('Failed to fetch userid', error)
        }
    }

    const loadSinglePost = async (post: Post) => {
        setLoading(true)
        await fetchUserId()
        setSinglePostUserDetails({pfp:post.pfp, name:post.userName})
        const result=await loadSinglePostDetails(post._id)
        setLoading(false)
        setSelectedPost(result.result)
    }

    const handleAddComment = async (id:string) => {
        setLoading(true)
        const data = {
          comment:newComment,
          post:id
        }
        await addComment(data)
        const post=await loadSinglePostDetails(id)
        setNewComment('')
        setSelectedPost(post.result)
        setLoading(false)
    }

    return (
        <div>
            {selectedPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <div className='flex'>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="cursor-pointer absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                    <div className="p-6">
                        {/* Post Header */}
                        <div className="flex items-center space-x-3 mb-4">
                        {singlePostUserDetails?.pfp? (
                            <Image width={300} height={300} src={singlePostUserDetails.pfp || "/placeholder.svg"} alt={singlePostUserDetails.name ?? ''} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <User className="h-10 w-10 rounded-full object-cover"/>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-900">{singlePostUserDetails?.name}</h3>
                            <p className="text-gray-500 text-sm">{new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                        </div>
                        </div>

                        {/* Post Content */}
                        {selectedPost.text && (
                        <p className="text-gray-800 mb-4 leading-relaxed">{selectedPost.text}</p>
                        )}

                        {/* Post Image */}
                        {selectedPost.image && (
                        <div className="mb-4 -mx-6">
                            <Image width={300} height={300} src={selectedPost.image || "/placeholder.svg"} alt="Post content" className="w-full h-96 object-cover" />
                        </div>
                        )}

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mb-4">
                        <div className="flex items-center space-x-1">
                            <Heart size={16} className={`text-red-500 ${userId && selectedPost.likedBy.includes(userId)? 'fill-red-500':'' }`} />
                            <span>{selectedPost.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageCircle size={16} className="text-blue-500" />
                            <span>{selectedPost.comments.length}</span>
                        </div>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-gray-200 pt-4 space-y-4">
                        <h4 className="font-semibold text-gray-900">Comments</h4>
                        
                        {/* Comments List */}
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {selectedPost.comments?.length > 0 ? (
                            selectedPost.comments?.map((comment) => (
                                <div key={comment._id} className="flex space-x-3">
                                {comment.pfp? (
                                    <Image width={300} height={300} src={comment.pfp || "/placeholder.svg"} alt={comment.userName} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 rounded-full object-cover"/>
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{comment.userName} <span className="text-gray-500 font-normal text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span></p>
                                    <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
                                </div>
                                </div>
                            ))
                            ) : (
                            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="border-t border-gray-200 pt-4 flex space-x-3">
                            <Image width={300} height={300} src="/professional-woman-avatar.png" alt="Your avatar" className="h-10 w-10 rounded-full object-cover" />
                            <div className="flex-1 flex items-end space-x-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={()=>handleAddComment(selectedPost._id)}
                                disabled={!newComment.trim()}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm transition"
                            >
                                Post
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            )}
            <div style={{ columnCount: 3, columnGap: "1.5rem" }} className="gap-6 mt-3">
                {posts && posts.length>0 ? (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow mb-6 break-inside-avoid"
                            onClick={()=>loadSinglePost(post)}
                        >
                            {post.image && (
                            <div className="w-full h-48 overflow-hidden bg-gray-200">
                                <Image
                                width={300}
                                height={300}
                                src={post.image}
                                alt={post.title ?? ''}
                                className="w-full h-full object-cover"
                                />
                            </div>
                            )}
    
                            {/* Post Content */}
                            <div className="p-4">
                            {post.text && <p className="text-gray-600 text-sm">{post.text}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex justify-center align-middle py-3'>
                        <h2>You have no posts</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyPosts
