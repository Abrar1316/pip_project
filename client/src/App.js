import './App.css';
import PostList from './components/PostList';
import EditPost from './components/EditPost';
import AddPost from './components/AddPost';
import { Routes, Route, Link} from "react-router-dom";
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <div className="App">
      <h1 style={{backgroundColor:"black",color:"white",padding:"10px"}}>Navbar MERN App</h1>
      
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/editPost" element={<EditPost />} />
        <Route path="/addPost" element={<AddPost />} />
      </Routes>
    </div>
  );
}

export default App;
