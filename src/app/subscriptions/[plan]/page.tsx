import { redirect } from 'next/navigation';

// Old fixed-price plan pages (/subscriptions/basic etc.). Regular deliveries are
// arranged with the team, so these links go to the request form.
export default function OldPlanRedirect() {
    redirect('/subscriptions#request');
}
