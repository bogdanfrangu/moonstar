import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [postsPerPageValue, setPostsPerPageValue] = useState(5);

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setPostsPerPage(postsPerPage + 5);
    }
  };

  useEffect(() => {
    setPostsPerPage(postsPerPageValue);
  }, [postsPerPageValue]);

  useEffect(() => {
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get<Comment[]>("https://jsonplaceholder.typicode.com/comments")
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="posts-list">
      {posts.slice(0, postsPerPage).map((post) => (
        <div className="post" key={post.id}>
          <div className="post-header">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
          <div className="post-comments">
            <h4>
              Comments:{" "}
              {comments.filter((comment) => comment.postId === post.id).length}
            </h4>
            <button onClick={handleShowComments}>
              {showComments ? "Hide comments" : "Show comments"}
            </button>
            <div className={`comments ${showComments ? "show" : "hide"}`}>
              {comments
                .filter((comment) => comment.postId === post.id)
                .map((comment) => (
                  <div className="comment" key={comment.id}>
                    <p>{comment.body}</p>
                    <p>By: {comment.email}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
