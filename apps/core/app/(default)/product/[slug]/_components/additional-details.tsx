
import { getProduct } from '~/client/queries/get-product';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@bigcommerce/components/accordion';

type Product = Awaited<ReturnType<typeof getProduct>>;

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CLP',
});

export const AdditionalDetails = ({ product }: { product: NonNullable<Product> }) => {

    return (
           
        <>
            <Accordion className="w-full" collapsible defaultValue="additional-details" type="single" >
        <AccordionItem value="additional-details">
                    <AccordionTrigger className=' text-xl font-bold md:text-2xl border-y p-4'>Additional details</AccordionTrigger>
                    <AccordionContent className='mt-2 p-4'>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Boolean(product.sku) && (
                                <div>
                                    <h3 className="font-semibold">SKU</h3>
                                    <p>{product.sku}</p>
                                </div>
                            )}
                            {Boolean(product.upc) && (
                                <div>
                                    <h3 className="font-semibold">UPC</h3>
                                    <p>{product.upc}</p>
                                </div>
                            )}
                            {Boolean(product.minPurchaseQuantity) && (
                                <div>
                                    <h3 className="font-semibold">Minimum purchase</h3>
                                    <p>{product.minPurchaseQuantity}</p>
                                </div>
                            )}
                            {Boolean(product.maxPurchaseQuantity) && (
                                <div>
                                    <h3 className="font-semibold">Maxiumum purchase</h3>
                                    <p>{product.maxPurchaseQuantity}</p>
                                </div>
                            )}
                            {Boolean(product.availabilityV2.description) && (
                                <div>
                                    <h3 className="font-semibold">Availability</h3>
                                    <p>{product.availabilityV2.description}</p>
                                </div>
                            )}
                            {Boolean(product.condition) && (
                                <div>
                                    <h3 className="font-semibold">Condition</h3>
                                    <p>{product.condition}</p>
                                </div>
                            )}
                            {Boolean(product.weight) && (
                                <div>
                                    <h3 className="font-semibold">Weight</h3>
                                    <p>
                                        {product.weight?.value} {product.weight?.unit}
                                    </p>
                                </div>
                            )}
                            {Boolean(product.customFields) &&
                                product.customFields.map((customField) => (
                                    <div key={customField.entityId}>
                                        <h3 className="font-semibold">{customField.name}</h3>
                                        <p>{customField.value}</p>
                                    </div>
                                ))}
                        </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
        </>
    );
};
