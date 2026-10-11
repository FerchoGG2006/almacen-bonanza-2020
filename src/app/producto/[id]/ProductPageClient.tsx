'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/index';
import { useShop } from '../../../context/ShopContext';
import { ProductDetail } from '../../../components/ProductDetail';

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductPageClient: React.FC<ProductPageClientProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const {
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
  } = useShop();

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      isWishlisted={wishlist.includes(product.id)}
      onToggleWishlist={handleToggleWishlist}
      onAddToCart={handleAddToCart}
      onNavigateHome={() => router.push('/')}
      onNavigateToTienda={() => router.push('/tienda')}
      onSelectProduct={(id: number) => router.push(`/producto/${id}`)}
    />
  );
};
