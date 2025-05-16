import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductsList from "./Components/ProductsList";
import ProductForm from "./Components/ProductForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/new" element={<ProductForm key="new" />} />
        <Route path="/products/:id/edit" element={<ProductForm key="edit" />} />
      </Routes>
    </Router>
  );
}

export default App;
