/**
 * Quote
 * A Quote
 */
declare interface Quote {
    id?: number;
    createdAt?: string | null;
    movieId?: number | null;
    quote: string;
    saidBy: string;
}
export { Quote };
