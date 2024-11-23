
export interface CartItem {
    product_id: string;
    name: string;
    price: number;
    total_price: number;
    quantity: number;
}


export function addToCart(item: CartItem): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart
    const existingItem = cart.find(cartItem => cartItem.product_id === item.product_id);

    if (existingItem) {
        existingItem.quantity += item.quantity; // Update quantity if item exists
        existingItem.total_price = existingItem.quantity * existingItem.price; // Update total price
    } else {
        item.total_price = item.quantity * item.price;
        cart.push(item); // Add new item
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    console.log('Item added to cart:', cart);
}

export function getCart(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart or return empty array
}
