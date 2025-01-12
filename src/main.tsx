import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.tsx'
import { Provider } from 'react-redux'
import { store } from "./store/store"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage.tsx'
import AddProductPage from './pages/AddProductPage.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path="/" element={<Layout />}>
      <Route index element={<ProductsPage />}></Route>
      <Route path="add-product" element={<AddProductPage />}></Route>
    </Route>
  </>
  )
)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

)