import { Product } from "@/types/product";
import { Card } from "../ui/card";

export default function InventoryStatus({ products }: { products: Product[] }) {
    const lowStockProducts = products.filter(product => product.stock < 100);

    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">Inventory Status</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Low Stock Items</h4>
                    {lowStockProducts.length > 0 ? (
                        <ul className="space-y-2">
                            {lowStockProducts.map(product => (
                                <li key={product.id} className="flex justify-between">
                                    <span className="text-sm text-gray-600">{product.name}</span>
                                    <span className="text-sm font-medium text-red-600">{product.stock} left</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">All items have sufficient stock</p>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Total Products</h4>
                    <p className="text-2xl font-bold text-epilux-blue">{products.length}</p>
                </div>
            </div>
        </Card>
    );
}