import { redirect } from 'next/navigation';

// There is no separate affiliate account: every customer can refer friends and
// earns 40% of their rewards. The old /affiliate/* pages now live on Refer & earn.
export default function AffiliateRedirect() {
    redirect('/products/referrals');
}
