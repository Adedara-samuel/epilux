import { redirect } from 'next/navigation';

// Old promotional pages had no matching products or checkout; send visitors to the shop.
export default function OldOfferRedirect() {
    redirect('/products');
}
