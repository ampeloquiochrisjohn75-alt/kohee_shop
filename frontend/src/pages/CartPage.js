import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import './CartPage.css';

export default function CartPage(){
  const { items, removeFromCart } = useContext(CartContext);
  const { addToCart, fetchCart } = useContext(CartContext);

  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(()=>{
    const q = {};
    const s = {};
    items.forEach(it => { q[it.productId] = it.quantity; s[it.productId] = true; });
    setQuantities(q);
    setSelected(s);
  }, [items]);

  const toggleSelected = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  const changeQtyLocal = (id, val) => setQuantities(prev => ({ ...prev, [id]: val }));

  const updateQuantity = async (id) => {
    const newQty = Number(quantities[id]) || 0;
    const item = items.find(it => it.productId === id);
    const cur = item ? item.quantity : 0;
    try {
      if (newQty === 0) {
        await removeFromCart(id);
      } else if (newQty !== cur) {
        // remove then add exact quantity
        await removeFromCart(id);
        await addToCart(id, newQty);
      }
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
      alert('Failed to update quantity');
    }
  };

  const checkoutSelected = () => {
    const sel = items.filter(it => selected[it.productId]);
    if (!sel.length) return alert('No items selected');
    const total = sel.reduce((s,it)=> s + it.price * quantities[it.productId], 0);
    alert(`Checkout ${sel.length} items - total $${total.toFixed(2)}`);
  };
  const inlineBg = { backgroundImage: "url('/uploads/menubg.jpg')" };

  return (
    <div className="cart-page" style={inlineBg}>
      <div className="cart-panel" style={{ padding: 16 }}>
        <h2>Your Cart</h2>

        {items.length === 0 ? <div>Cart is empty</div> : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div />
              <div>
                <button onClick={checkoutSelected} style={{ marginRight: 8 }}>Checkout selected</button>
              </div>
            </div>
            <ul className="cart-list">
              {items.map(it=> (
                <li key={it.productId} className="cart-item">
                  <div className="cart-item-left">
                    <input type="checkbox" checked={!!selected[it.productId]} onChange={()=>toggleSelected(it.productId)} />
                    <img src={it.image || '/uploads/placeholder-coffee.jpg'} alt={it.name} className="cart-item-image" />
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div style={{ color: '#ddd' }}>{it.price ? `$${it.price}` : ''}</div>
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <div>
                      <button onClick={()=> changeQtyLocal(it.productId, Math.max(0, (quantities[it.productId]||0) - 1))}>-</button>
                      <input className="qty-input" type="number" value={quantities[it.productId]||0} onChange={e=>changeQtyLocal(it.productId, Number(e.target.value))} />
                      <button onClick={()=> changeQtyLocal(it.productId, (quantities[it.productId]||0) + 1)}>+</button>
                      <button onClick={()=>updateQuantity(it.productId)} style={{ marginLeft: 8 }}>Update</button>
                      <button onClick={()=>removeFromCart(it.productId)} style={{ marginLeft: 8 }}>Remove</button>
                    </div>
                    <div style={{ marginTop: 8 }}>Subtotal: ${((quantities[it.productId]||0) * it.price).toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
