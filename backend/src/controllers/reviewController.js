const Review = require("../models/Review");

exports.createReview = async (req, res) => {

    try {

        const {

            orderId,

            productId,

            rating,

            comment

        } = req.body;

        const exists = await Review.findOne({

            orderId,

            productId,

            userId: req.user.id

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Review already submitted"

            });

        }

        const review = await Review.create({

            orderId,

            productId,

            userId: req.user.id,

            rating,

            comment

        });

        res.json({

            success: true,

            message: "Review submitted successfully",

            data: review

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }


};

exports.getProductReviews = async (req, res) => {

    try {

        const reviews = await Review.find({

            productId: req.params.productId,

            isApproved: true,

            deletedAt: null

        })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 });

        const totalReviews = reviews.length;

        const averageRating =
            totalReviews === 0
                ? 0
                : (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    totalReviews
                ).toFixed(1);

        res.json({

            success: true,

            data: {

                reviews,

                totalReviews,

                averageRating

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};