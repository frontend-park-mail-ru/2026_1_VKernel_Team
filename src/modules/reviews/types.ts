export interface ReviewSender {
    id: number;
    name: string;
    avatar_path: string;
}

export interface ReviewProduct {
    id: number;
    title: string;
    photo: string;
}

export interface Review {
    id: number;
    sender: ReviewSender;
    receiver_id: number;
    product: ReviewProduct;
    rating: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface ReviewListResponse {
    reviews: Review[];
    next_cursor: number | null;
}

export interface ReviewSummary {
    average: number;
    total: number;
    distribution: Record<string, number>;
}

export type ReviewSummaryResponse = ReviewSummary;

export interface CreateReviewPayload {
    receiver_id: number;
    product_id: number;
    rating: number;
    content: string;
}

export interface UpdateReviewPayload {
    rating: number;
    content: string;
}

export type ReviewModalMode = 'create' | 'edit';

export interface FormattedReview {
    id: number;
    rating: number;
    ratingStars: string;
    content: string;
    senderId: number;
    senderName: string;
    senderAvatar: string;
    productId: number;
    productTitle: string;
    productPhoto: string;
    receiverId: number;
    createdDate: string;
    isEdited: boolean;
}
