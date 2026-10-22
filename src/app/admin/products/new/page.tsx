import { redirect } from 'next/navigation';

// Products are added from the editor on the products page
export default function NewProductPage() {
    redirect('/admin/products?edit=new');
}
