
export const getCart = () => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
};

export const addToCart = (product: any, quantity: number) => {
    const cart = getCart();
    const existingItem = cart.find((item: any) => item.product_id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total_price = existingItem.quantity * existingItem.price;
    } else {
        cart.push({ ...product, quantity, total_price: product.price * quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const updateCart = (productId: string, quantity: number) => {
    const cart = getCart();
    const item = cart.find((item: any) => item.product_id === productId);
    if (item) {
        item.quantity = quantity;
        item.total_price = item.price * quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (productId: string) => {
    const cart = getCart().filter((item: any) => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
};