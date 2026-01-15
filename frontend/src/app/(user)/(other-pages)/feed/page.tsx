"use client";

import { useEffect, useRef, useState } from 'react'
import { Heart, MessageCircle, ImageIcon, Smile, X, User } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { enqueueSnackbar } from 'notistack';
import { addComment, alterPostLike, getAllPosts, getUserDetails, loadSinglePostDetails, postContent, viewOtherUserDetails } from '@/services/userService';
import { useLoading } from '../../template';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LikedUsersModal from '@/reusable-components/likedUsersList';

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
  createdBy: string
  userName: string
  text?: string
  image?: string
  createdAt: string
  likes: number
  likedBy: string[]
  comments: Comment[]
}

interface LikedUsers {
  pfp?: string,
  name: string
}

interface SinglePostUserDetails {
  pfp?: string
  name: string
}

export default function FeedsPage() {
  const setLoading=useLoading()
  const router=useRouter()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [singlePostUserDetails, setSinglePostUserDetails]=useState<SinglePostUserDetails | null>(null)
  const [emojiPicker, setEmojiPicker]=useState(false)
  const [file, setFile]=useState<File | null>(null)
  const fileRef=useRef<HTMLInputElement | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading]=useState(false)
  const [finished, setFinished]=useState(false)
  const [userId, setUserId]=useState<string | null>(null)
  const [content, setContent] = useState('')
  const [newComment, setNewComment] = useState('')
  const [likedUserDetails, setLikedUserDetails] = useState<LikedUsers[]>([])
  const [showLikedUsers, setShowLikedUsers] = useState(false)
  const shownRef = useRef(0)
  const hasFetched = useRef(false)
  const LIMIT=2

  useEffect(()=>{
    if (hasFetched.current) return
    hasFetched.current = true
    getPosts()
  }, [])
  
  const getPosts = async () => {
    setIsLoading(true)
    await fetchUserId()
    const result=await getAllPosts(LIMIT, shownRef.current)
    shownRef.current+=result.result.allPost.length
    if(shownRef.current>=result.result.count) setFinished(true)
      console.log('1', result)
    setPosts([...result.result.allPost])
    setIsLoading(false)
  }

  const fetchUserId=async()=>{
    try {
      const res=await fetch('/server/me', {method:"GET", credentials:"include"})
      const data=await res.json()
      setUserId(data.userId)
    } catch (error) {
      console.log('Failed to fetch userid', error)
    }
  }
  
  const handleLoadMore = async () => {
    setLoading(true)
    const result=await getAllPosts(LIMIT, shownRef.current)
    shownRef.current+=result.result.allPost.length
    if(shownRef.current>=result.result.count) setFinished(true)
    setPosts([...posts, ...result.result.allPost])
    setLoading(false)
  }

  const handlePost = async () => {
    setLoading(true)
    const formData=new FormData()
    if (file) formData.append('image', file)
    formData.append('content', content)
    const result=await postContent(formData)
    setContent('')
    setFile(null)
    setLoading(false)
    setPosts([result.result, ...posts])
    shownRef.current+=1
  }

  const handleLike = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post: Post) => {
        if (post._id !== postId) return post;

        const alreadyLiked = userId ? post.likedBy.includes(userId) : false;

        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked
            ? post.likedBy.filter((id: string) => id !== userId)
            : [...post.likedBy, userId ?? ''],
        };
      })
    );
    await alterPostLike(postId)
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

  const openFiles = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image=e.target.files?.[0]
    if (!image) return
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if(!validTypes.includes(image.type)){
      enqueueSnackbar('Please choose a valid image', {variant:'error'})
      return
    }
    setFile(image)
  }

  const loadSinglePost = async (post: Post) => {
    setLoading(true)
    setSinglePostUserDetails({pfp:post.pfp, name:post.userName})
    const result=await loadSinglePostDetails(post._id)
    setLoading(false)
    console.log(result.result)
    setSelectedPost(result.result)
  }

  const routeToUserProfile = async (id:string) => {
    setLoading(true)
    if(id==userId){
      router.push(`/profile/user`)
    }else{
      router.push(`/meetPeople/${id}`)
    }
  }

  const seeLikedUsers = async (users:string[]) => {
    setLoading(true)
    for(const user of users) { 
      const result=await viewOtherUserDetails(user)
      setLikedUserDetails(prev => [...prev, {pfp: result.userDetails?.profilePicture, name:result.userDetails?.username}])
    }
    setLoading(false)
    setShowLikedUsers(true)
  }

  const closeLikedUserModal = async () => {
    setLikedUserDetails([])
    setShowLikedUsers(false)
  }

  if (isLoading) {
    return (
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Your Feed is Loading</h2>
              <p className="text-gray-500 mt-2">Getting your latest posts...</p>
            </div>
          </main>
    )
  }

  return (
        <main className="flex-1 overflow-auto">
          <div className="max-w-8xl mx-auto px-4 py-6 space-y-4">
            {showLikedUsers && (
              <LikedUsersModal onClose={closeLikedUserModal} users={likedUserDetails}/>
            )}
            {selectedPost && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>

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
                        <Image width={300} height={300} src={selectedPost.image || "/placeholder.svg"} alt="Post content" className="w-full object-cover" />
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mb-4">
                      <div 
                      className="flex items-center space-x-1"
                      onClick={()=>seeLikedUsers(selectedPost.likedBy)}
                      >
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
            {/* Post Creation Box */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start space-x-4">
                {/* <Image width={300} height={300} src="/professional-woman-avatar.png" alt="Your avatar" className="h-10 w-10 rounded-full object-cover" /> */}
                <User className="h-10 w-10 rounded-full object-cover"/>
                <div className="flex-1">
                  <div className='flex'>
                    <div className={`flex-1 transition-all duration-300 ${file ? "w-[65%]" : "w-full"}`}>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm 
                                  focus:outline-none focus:border-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                    {file && (
                      <div className="relative ml-3 w-[35%] max-w-[120px]">
                        <Image
                        width={300}
                        height={300}
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={() => setFile(null)}
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 
                                    rounded-full w-6 h-6 flex items-center justify-center text-gray-600 
                                    hover:bg-gray-100"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <input 
                      type="file" 
                      ref={fileRef}
                      className='hidden'
                      onChange={handleFileChange}
                      />
                      {!file && (
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                          <ImageIcon size={20} onClick={openFiles}/>
                        </button>
                      )}
                      <div className='relative inline-block'>
                        <button 
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        onClick={()=>setEmojiPicker(prev=>!prev)}
                        >
                          <Smile size={20} />
                        </button>
                        {emojiPicker && (
                          <div className="absolute top-10 left-0 z-50 shadow-lg 
                            w-[100px] sm:w-[100px] md:w-[100px] ">
                            <EmojiPicker
                              onEmojiClick={(emojiData) => {
                                setContent(prev=>prev+emojiData.emoji)
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handlePost}
                      disabled={!content.trim() && !file}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
            {posts && posts.length>0 ? (
              <>
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div 
                        onClick={() => routeToUserProfile (post.createdBy)}
                        className="cursor-pointer flex items-center space-x-3"
                        >
                          {post.pfp? (
                            <Image src={post.pfp} width={300} height={300} alt={post.userName} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <User className="h-10 w-10 rounded-full object-cover"/>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{post.userName}</h3>
                            <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {post.text && (
                        <p className="text-gray-800 text-sm mb-3 leading-relaxed">{post.text}</p>
                      )}

                      {post.image && (
                        <div className='w-full flex justify-center'>
                          <div className="mb-4 -mx-4">
                            <Image
                              width={300}
                              height={300}
                              src={post.image || "/placeholder.svg"}
                              alt="Post content"
                              className="w-100 object-cover"
                              style={{ aspectRatio: "auto" }}
                            />
                          </div>
                        </div>
                    )}

                    <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                        >
                          <Heart size={18} fill={userId && post.likedBy.includes(userId) ? '#EF4444' : 'none'} color={userId && post.likedBy.includes(userId) ? '#EF4444' : 'currentColor'} />
                          <div className='ml-1'>{post.likes}</div>
                        </button>
                        <button 
                          onClick={() => loadSinglePost(post)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition"
                        >
                          <MessageCircle size={18} />
                          <div className='ml-1'>{post.comments.length}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                </div>

                <h2 className="text-lg font-semibold text-gray-700">
                  No posts available
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Posts will appear here once they are created.
                </p>
              </div>
            )}
            {posts && !finished && (
              <div className="flex justify-center py-6">
                <button
                  onClick={handleLoadMore}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition"
                >
                  Load More Posts
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
  )
}
