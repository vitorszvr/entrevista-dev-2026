export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export function isValidProduct(data: unknown): data is Product {
  if (typeof data !== 'object' || data === null) return false;

  const p = data as Product;
  return (
    typeof p.id === 'number' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    typeof p.description === 'string' &&
    typeof p.image === 'string' &&
    typeof p.category === 'string' &&
    typeof p.stock === 'number'
  );
}

export function isValidCartItem(data: unknown): data is CartItem {
  return (
    isValidProduct(data) && typeof (data as CartItem).quantity === 'number'
  );
}
