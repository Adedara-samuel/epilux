import { Card } from "../ui/card";


interface Affiliate {
  name: string;
  sales: number;
  commission: number;
}

export default function TopAffiliates({ affiliates }: { affiliates: Affiliate[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Top Affiliates</h3>
      <div className="space-y-4">
        {affiliates.map((affiliate, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-epilux-blue/10 flex items-center justify-center">
                <span className="text-epilux-blue font-medium">{affiliate.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{affiliate.name}</p>
                <p className="text-sm text-gray-500">{affiliate.sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-epilux-blue">₦{affiliate.commission.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}