import { NextResponse } from 'next/server';
import products from '@/data/products.json';
import { Product } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 },
    );
  }

  return NextResponse.json(product as Product);
}
