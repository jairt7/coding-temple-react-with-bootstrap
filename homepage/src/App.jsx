import { useState } from 'react'
import Homepage from './components/HomePage'
import ShopNow from './components/ShopNow'
import NotFound from './components/NotFound'
import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/shop-now" element={<ShopNow />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>

  )
}

export default App;
