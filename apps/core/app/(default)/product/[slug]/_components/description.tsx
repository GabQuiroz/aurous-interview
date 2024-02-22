import { getProduct } from '~/client/queries/get-product';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@bigcommerce/components/accordion';
type Product = Awaited<ReturnType<typeof getProduct>>;

export const Description = ({ product }: { product: NonNullable<Product> }) => {
  if (!product.description) {
    return null;
  }

  return (
    <>      
      <Accordion className="w-full mt-4" collapsible defaultValue="description" type="single" >
        <AccordionItem value="description">
          <AccordionTrigger className=' text-xl md:text-2xl border-y  p-4 text-black '><h3>Descripción</h3></AccordionTrigger>
          <AccordionContent className='mt-2 '>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
