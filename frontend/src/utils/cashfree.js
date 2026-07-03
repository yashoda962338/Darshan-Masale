import { load } from "@cashfreepayments/cashfree-js";

let cashfree;

export const initializeCashfree = async () => {

    if (!cashfree) {

        cashfree = await load({
            mode: import.meta.env.VITE_CASHFREE_MODE
        });

    }

    return cashfree;
};