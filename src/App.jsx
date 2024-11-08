import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState(new Set());
  const [inputValue, setInputValue] = useState('');

  const addPost = (data) => {
    const now = new Date();
    const newPost = {
      id: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      data: data
    };
    setPosts(prevPosts => new Set([...prevPosts, newPost]));
  }

  return (
    <>
      <input 
        className="w-full text-center p-4 m-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            addPost(inputValue);
            setInputValue('');
          }
        }}
        placeholder="Type here to update your daily changelog"
      />

      <table>
        <thead>
          <td><h2 className="md:font-bold text-center">Daily Changelog</h2></td>
        </thead>
        <tbody>
          {Array.from(posts).reverse().map(post => (
            <tr className="m-4" key={post.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
              <td style={{ 
                width: "fit-content"
              }}>{post.id} </td>
              <td>{post.data}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
