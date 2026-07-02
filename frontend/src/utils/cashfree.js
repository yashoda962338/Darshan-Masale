import { load } from "@cashfreepayments/cashfree-js";

let cashfree;

export const initializeCashfree = async () => {

    if (!cashfree) {

        cashfree = await load({

            mode: "sandbox"

        });

    }

    return cashfree;

};