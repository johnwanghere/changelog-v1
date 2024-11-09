import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://budolcvsnaskboqxemzr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZG9sY3ZzbmFza2JvcXhlbXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMDkwNTIsImV4cCI6MjA0NjY4NTA1Mn0.LBNdpxvVBSoqOzye6ZWS9F1efpSmkvxzD_AqYcYCkY0");

function App() {
  const [posts, setPosts] = useState(new Set());
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPost = async (content) => {
    if (isSubmitting || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
    
      const newPost = {
        time: now.toISOString(),
        content: content
      };

      // Insert into Supabase
      const { data, error } = await supabase
      .from('posts')
      .insert([newPost])
      .select();

      if (error) {
        console.error('Error inserting post:', error);
        return;
      }

      // Add to local state with formatted time
      const localPost = {
        ...data[0],
        time: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };

      setPosts(prevPosts => new Set([...prevPosts, localPost]));
      setInputValue('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Add this function to fetch posts on component mount
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    // Convert Supabase posts to your post format
    const formattedPosts = data.map(post => {
      try {
        const date = new Date(post.time);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return {
          time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          id: post.id,
          content: post.content
        }
      } catch (e) {
        console.error('Error formatting data for post:', post);
        return null;
      }
    }).filter(Boolean);
      
    setPosts(new Set(formattedPosts));
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex gap-4 w-full max-w-7xl mx-auto px-4">
        <input 
          className="text-center p-4 border w-96 border-blue-700 text-m h-12"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              addPost(inputValue);
            }
          }}
          placeholder="Type here to update your daily changelog"
        />
        <button 
          className="px-2 text-center p-4 bg-blue-700 w-20 justify-center items-center flex text-white rounded"
          onClick={(e) => {
            if (inputValue.trim()) {
              addPost(inputValue);
            }
            
          }}
          disabled={isSubmitting}
          >{isSubmitting ? 'Saving... ' : 'Submit'}
        </button>
      </div>

      <table>
        <thead>
          <tr><th><h2 className="md:font-bold text-center">Daily Changelog</h2></th></tr>
        </thead>
        <tbody>
          {Array.from(posts).reverse().map(post => (
            <tr 
              className="m-4" 
              key={post.id}  // Make sure post.id exists and is unique
              style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
            >
              <td style={{ 
                width: "fit-content"
              }}>{post.time}</td>
              <td>{post.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
