import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProduct } from '~/client/queries/get-product';

import { BreadCrumbs } from './_components/breadcrumbs';
import { Description } from './_components/description';
import { Details } from './_components/details';
import { Gallery } from './_components/gallery';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';
import { AdditionalDetails } from './_components/additional-details';

interface ProductPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productId = Number(params.slug);
  const product = await getProduct(productId);

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params, searchParams }: ProductPageProps) {
  const productId = Number(params.slug);
  const { slug, ...options } = searchParams;

  const optionValueIds = Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );

  const product = await getProduct(productId, optionValueIds);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <BreadCrumbs productId={product.entityId} />
      <div className="mb-12 mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <Gallery product={product} />
        <Details product={product} />

        <div className="lg:col-span-2">
          {/* <Description product={product} /> */}
          <AdditionalDetails  product={product} />
          <Warranty product={product} />
          <Suspense fallback="Loading...">
            <Reviews productId={product.entityId} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback="Loading...">
        <RelatedProducts productId={product.entityId} />
      </Suspense>
    </>
  );
}

export const runtime = 'edge';
