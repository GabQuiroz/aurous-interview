// import { Counter } from '@bigcommerce/components/counter';
import { Label } from '@bigcommerce/components/label';
import { getProduct } from '~/client/queries/get-product';

import { Select, SelectContent, SelectItem } from '@bigcommerce/components/select';

type Product = Awaited<ReturnType<typeof getProduct>>;

import { useProductFieldController } from '../use-product-form';

export const QuantityField = ({ product }: { product: NonNullable<Product> }) => {
  const { field } = useProductFieldController({
    name: 'quantity',
    rules: { required: true, min: 1 },
    defaultValue: 1,
  });
  console.log("HOLA")
  console.log(product) 




  return (
    <div className="@md:w-32">
      <Label className="mb-2 inline-block font-semibold" htmlFor="quantity">
        Quantity
      </Label>

      <Select
        value={field.value?.toString()}
        onValueChange={(value) => {
          field.onChange(value);
        }}
        disabled={Boolean(product.availabilityV2.status) === false}
      >
      <SelectContent >
        
        {Array.from({ length: product.maxPurchaseQuantity? product.maxPurchaseQuantity: 99 }).map((_,i) => (
          <SelectItem value={String(i + 1)} key={i + 1}>
            {i+ 1}
          </SelectItem>
        ))}

      
        </SelectContent>
      </Select>
      {/* <Counter
        id="quantity"
        min={1}
        name={field.name}
        onChange={field.onChange}
        value={Number(field.value)}
      /> */}
    </div>
  );
};
