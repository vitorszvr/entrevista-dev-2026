import { NextResponse } from 'next/server';
import products from '@/data/products.json';
import { Product } from '@/types';

export async function GET() {
  const allProducts: Product[] = products;

  return NextResponse.json(allProducts);
}
