import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  const CartContext = createContext();
  
  export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, settotalItems] = useState(0);
    const [coupon, setCoupon] = useState("");
    const [isUsingCoupon, setIsUsingCoupon] = useState(false);
  
    function addProductToCart(item) {
      const hasItemIncludedIn = cartItems.some((i) => i.id === item.id);
  
      if (hasItemIncludedIn) return;
  
      const newCart = [...cartItems, item];
  
      setCartItems(newCart);
    }
  
    function deleteProduct(id) {
      const newCart = cartItems.filter((item) => item.id !== id);
  
      setCartItems(newCart);
    }
  
    function alterProductAmount(type, id) {
      const selectedItem = cartItems.find((item) => item.id === id);
  
      if (selectedItem) {
        if (type === "increase") selectedItem.amount++;
        else {
          if (selectedItem.amount === 1) return;
  
          selectedItem.amount--;
        }
      }
  
      const newCartItems = cartItems.map((item) =>
        item.id !== id ? item : selectedItem
      );
  
      setCartItems(newCartItems);
    }
  
    function addCoupon(coupon) {
      const couponValue = coupon.toUpperCase();
  
      if (couponValue === "10%OFF") {
        setCoupon(couponValue);
        setIsUsingCoupon(true);
      }
    }
  
    // useEffect(() => {
  
    // });
  
    useEffect(() => {
      if (!cartItems.length) {
        setTotalPrice(0);
        settotalItems(0);
        return;
      }
      
      const totalPrice = cartItems
        .map((item) => item.prices[0].price * item.amount)
        .reduce((prev, value) => prev + value);
      const totalItems = cartItems
        .map((item) => item.amount)
        .reduce((prev, value) => prev + value);
  
      setTotalPrice(totalPrice);
      settotalItems(totalItems);
    }, [cartItems]);
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          totalPrice,
          totalItems,
          coupon,
          isUsingCoupon,
          addProductToCart,
          deleteProduct,
          alterProductAmount,
          addCoupon,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }
  
  export function useCart() {
    return useContext(CartContext);
  }
  