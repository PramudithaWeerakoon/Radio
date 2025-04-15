import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
    if (!stripePromise) {
        const key = "pk_test_51RE3Nx4N6RvwXaQvIENsXT20l2KUmuB14AUdZtj5if3hQqERHo92j11kD98odwdquCTSeMYzdIxSwan32yRLD4WC0091IciD00";
        if (!key) {
            console.error('Missing Stripe publishable key');
            return null;
        }
        stripePromise = loadStripe(key);
    }
    return stripePromise;
};