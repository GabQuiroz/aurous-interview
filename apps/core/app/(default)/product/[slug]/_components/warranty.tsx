import { getProduct } from '~/client/queries/get-product';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@bigcommerce/components/accordion';
type Product = Awaited<ReturnType<typeof getProduct>>;

export const Warranty = ({ product }: { product: NonNullable<Product> }) => {
  if (!product.warranty) {
    return null;
  }

  return (
    <>
      <Accordion className="w-full " collapsible defaultValue="warranty" type="single" >
          <AccordionItem value="warranty">
          <AccordionTrigger className='text-xl md:text-2xl border-y bg-gray-100 p-4 text-black'>Warranty</AccordionTrigger>
          <AccordionContent className='mt-2'>
              <p>{product.warranty}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    </>
  );
};
