import api from "./api";

const reviewService = {

    getProductReviews: async (productId) => {

        const res = await api.get(`/reviews/product/${productId}`);

        return res.data;

    }

};

export default reviewService;