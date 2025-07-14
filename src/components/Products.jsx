import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/products.css'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) console.error(error)
      else setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <div className="products-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          {p.ar_model_url ? (
            <model-viewer
              src={p.ar_model_url}
              alt="3D model preview"
              auto-rotate
              camera-controls
              ar
              style={{ width: '100%', height: '250px', borderRadius: '8px', background: '#f8f8f8' }}
            ></model-viewer>
          ) : (
            <img
              src={p.image_url}
              alt={p.name}
              className="product-image"
            />
          )}

          <h3 className="product-name">{p.name}</h3>
          <p className="product-meta">{p.category} · {p.brand}</p>
          <p className="product-price">₹{p.price}</p>

          {p.tags && Array.isArray(p.tags) && (
            <div className="product-tags">
              {p.tags.map((tag, index) => (
                <span key={index} className="product-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
