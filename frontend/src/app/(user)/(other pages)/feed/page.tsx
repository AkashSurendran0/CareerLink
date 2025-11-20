"use client";

import { useEffect, useRef, useState } from 'react'
import { Heart, MessageCircle, ImageIcon, Smile, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { enqueueSnackbar } from 'notistack';
import { getAllPosts, postContent } from '@/services/userService';
import { useLoading } from '../../template';
import Image from 'next/image';

export default function FeedsPage() {
  const setLoading=useLoading()
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [emojiPicker, setEmojiPicker]=useState(false)
  const [file, setFile]=useState<File | null>()
  const fileRef=useRef(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading]=useState(false)

  const [content, setContent] = useState('')
  const [newComment, setNewComment] = useState('')

  useEffect(()=>{
    const getPosts = async () => {
      setIsLoading(true)
      const result=await getAllPosts()
      setPosts([...result.result])
      setIsLoading(false)
      console.log(result)
    }

    getPosts()
  }, [])

  const handlePost = async () => {
    setLoading(true)
    const formData=new FormData()
    formData.append('image', file)
    formData.append('content', content)
    const result=await postContent(formData)
    setContent('')
    setFile(null)
    setLoading(false)
    setPosts([result.result, ...posts])
    console.log(result)
  }

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  const handleAddComment = () => {
    
  }

  const openFiles = () => {
    fileRef.current.click()
  }

  const handleFileChange = (e) => {
    const image=e.target.files?.[0]
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if(!validTypes.includes(image.type)){
      enqueueSnackbar('Please choose a valid image', {variant:'error'})
      return
    }
    setFile(image)
  }

  const handleImageLoad = (postId: number, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setImageDimensions((prev) => ({
      ...prev,
      [postId]: { width: img.naturalWidth, height: img.naturalHeight },
    }))
  }

  const selectedPost = posts.find(p => p.id === selectedPostId)

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
            {selectedPost && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPostId(null)}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>

                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img src={selectedPost.avatar || "/placeholder.svg"} alt={selectedPost.author} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedPost.author}</h3>
                        <p className="text-gray-500 text-sm">{selectedPost.timestamp}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4 leading-relaxed">{selectedPost.content}</p>

                    {/* Post Image */}
                    {selectedPost.image && (
                      <div className="mb-4 -mx-6">
                        <img src={selectedPost.image || "/placeholder.svg"} alt="Post content" className="w-full h-96 object-cover" />
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} className="text-red-500" />
                        <span>{selectedPost.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} className="text-blue-500" />
                        <span>{selectedPost.comments}</span>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                      <h4 className="font-semibold text-gray-900">Comments</h4>
                      
                      {/* Comments List */}
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {selectedPost.commentsList.length > 0 ? (
                          selectedPost.commentsList.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <img src={comment.avatar || "/placeholder.svg"} alt={comment.author} className="h-10 w-10 rounded-full object-cover" />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">{comment.author} <span className="text-gray-500 font-normal text-xs">{comment.timestamp}</span></p>
                                <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="border-t border-gray-200 pt-4 flex space-x-3">
                        <img src="/professional-woman-avatar.png" alt="Your avatar" className="h-10 w-10 rounded-full object-cover" />
                        <div className="flex-1 flex items-end space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            placeholder="Write a comment..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={handleAddComment}
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
                <img src="/professional-woman-avatar.png" alt="Your avatar" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <input 
                      type="file" 
                      ref={fileRef}
                      className='hidden'
                      onChange={handleFileChange}
                      />
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        <ImageIcon size={20} onClick={openFiles}/>
                      </button>
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
                              // onEmojiClick={(emojiData) => {
                              //   setSelectedEmoji(emojiData.emoji);
                              //   setShowPicker(false);
                              // }}
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
            {posts.length>0 ? (
              <>
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img src={post.pfp || "/placeholder.svg"} alt={post.createdBy} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{post.createdBy}</h3>
                            <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {post.text && (
                        <p className="text-gray-800 text-sm mb-3 leading-relaxed">{post.text}</p>
                      )}

                      {post.image && (
                      <div className="mb-4 -mx-4">
                        <Image
                          width={300}
                          height={300}
                          src={post.image || "/placeholder.svg"}
                          alt="Post content"
                          onLoad={(e) => handleImageLoad(post.id, e)}
                          className="w-full object-cover"
                          style={{ aspectRatio: "auto" }}
                        />
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
                          <Heart size={18} fill={likedPosts.has(post._id) ? '#EF4444' : 'none'} color={likedPosts.has(post.id) ? '#EF4444' : 'currentColor'} />
                          <div className='ml-1'>{post.likes}</div>
                        </button>
                        <button 
                          onClick={() => setSelectedPostId(post._id)}
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
            {posts.length>0 && (
              <div className="flex justify-center py-6">
                <button
                  // onClick={handleLoadMore}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition"
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
