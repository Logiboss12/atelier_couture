import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'

import Home from './pages/public/Home.jsx'
import Gallery from './pages/public/Gallery.jsx'
import Shop from './pages/public/Shop.jsx'
import CustomOrder from './pages/public/CustomOrder.jsx'
import ClientArea from './pages/public/ClientArea.jsx'
import Booking from './pages/public/Booking.jsx'
import Contact from './pages/public/Contact.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import Clients from './pages/admin/Clients.jsx'
import Orders from './pages/admin/Orders.jsx'
import Quotes from './pages/admin/Quotes.jsx'
import Catalog from './pages/admin/Catalog.jsx'
import Stock from './pages/admin/Stock.jsx'
import StockEntry from './pages/admin/StockEntry.jsx'
import Promotions from './pages/admin/Promotions.jsx'
import Finances from './pages/admin/Finances.jsx'
import Deliveries from './pages/admin/Deliveries.jsx'
import Team from './pages/admin/Team.jsx'
import Settings from './pages/admin/Settings.jsx'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/galerie" element={<Gallery />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/sur-mesure" element={<CustomOrder />} />
            <Route path="/espace-client" element={<ClientArea />} />
            <Route path="/rendez-vous" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="commandes" element={<Orders />} />
            <Route path="devis" element={<Quotes />} />
            <Route path="catalogue" element={<Catalog />} />
            <Route path="stocks" element={<Stock />} />
            <Route path="stocks/entree" element={<StockEntry />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="finances" element={<Finances />} />
            <Route path="livraisons" element={<Deliveries />} />
            <Route path="equipe" element={<Team />} />
            <Route path="parametres" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
