import { redirect } from 'next/navigation';

// Orders are assigned to marketers from the order details panel
export default function MarketerAssignmentsPage() {
    redirect('/admin/orders?view=unassigned');
}
