import CharacterList from "./components/BrowseCharacters"
import Home from "./components/Home"
import Comics from "./components/Comics"
import CharacterDetails from "./components/CharacterDetail"
import NotFound from "./components/NotFound"
import NavigationBar from "./components/NavigationBar"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse-characters" element={<CharacterList />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/character-details/:id" element={<CharacterDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
  
}

export default App
