import { getBestSellingProducts } from '~/client/queries/get-best-selling-products';
import { getFeaturedProducts } from '~/client/queries/get-featured-products';
import { Hero } from '~/components/hero';
import { ProductCardCarousel } from '~/components/product-card-carousel';

export default async function Home() {
  const [bestSellingProducts, featuredProducts] = await Promise.all([
    getBestSellingProducts({ imageWidth: 500, imageHeight: 500 }),
    getFeaturedProducts({ imageWidth: 500, imageHeight: 500 }),
  ]);

  return (
    <>
      <Hero />

      <div className="my-10">
        <ProductCardCarousel
          products={featuredProducts}
          showCart={false}
          showCompare={false}
          showReviews={false}
          title="Featured products"
        />
        <ProductCardCarousel
          products={bestSellingProducts}
          showCart={false}
          showCompare={false}
          showReviews={false}
          title="Productos del Momento"
        />
      </div>
    </>
  );
}

export const runtime = 'edge';
