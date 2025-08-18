import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Loader2, Trash2, Pencil } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { FloatingDock } from "@/components/FloatingDock";
import { useToast } from "@/components/ui/use-toast";

type Review = {
  _id: string;
  userId: string;
  userName?: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
};

const Reviews: React.FC = () => {
  const { toast } = useToast();
  const [productId, setProductId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("");
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredReviews = useMemo(() => {
    const q = filter.toLowerCase();
    return reviews.filter(r =>
      (r.userName || "anonymous").toLowerCase().includes(q) ||
      (r.title || "").toLowerCase().includes(q) ||
      (r.comment || "").toLowerCase().includes(q)
    );
  }, [reviews, filter]);

  const loadReviews = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await adminAPI.getProductReviews(productId);
      setReviews(res.data || []);
    } catch (e: any) {
      toast({ title: e?.message || "Failed to fetch reviews", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // noop initial
  }, []);

  const startEdit = (review: Review) => {
    setEditReviewId(review._id);
    setEditRating(review.rating);
    setEditTitle(review.title || "");
    setEditComment(review.comment || "");
  };

  const cancelEdit = () => {
    setEditReviewId(null);
    setEditRating(0);
    setEditTitle("");
    setEditComment("");
  };

  const saveEdit = async () => {
    if (!productId || !editReviewId) return;
    try {
      setSaving(true);
      const res = await adminAPI.updateReviewById(productId, editReviewId, {
        rating: editRating,
        title: editTitle || undefined,
        comment: editComment || undefined,
      });
      if (res.success) {
        toast({ title: "Review updated" });
        // res.data is product; pull reviewsList if present
        if (res.data?.reviewsList) setReviews(res.data.reviewsList);
        cancelEdit();
      }
    } catch (e: any) {
      toast({ title: e?.message || "Failed to update review", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!productId) return;
    try {
      setSaving(true);
      const res = await adminAPI.deleteReviewById(productId, reviewId);
      if (res.success) {
        toast({ title: "Review deleted" });
        if (res.data?.reviewsList) setReviews(res.data.reviewsList);
        if (editReviewId === reviewId) cancelEdit();
      }
    } catch (e: any) {
      toast({ title: e?.message || "Failed to delete review", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Reviews Moderation</h1>

          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                <Input
                  placeholder="Enter Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
                <Button onClick={loadReviews} disabled={!productId || loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading</> : <>Fetch Reviews</>}
                </Button>
                <div className="flex-1" />
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Filter by name/title/comment"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...</div>
                ) : (
                  (filteredReviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews found.</p>
                  ) : (
                    filteredReviews.map((review) => (
                      <div key={review._id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {[1,2,3,4,5].map((n) => (
                              <Star key={n} className={`h-4 w-4 ${n <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                            <Badge variant="secondary">{review.userName || 'Anonymous'}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(review)}>
                              <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteReview(review._id)} disabled={saving}>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                        {review.title && <p className="font-medium mt-2">{review.title}</p>}
                        {review.comment && <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>}

                        {editReviewId === review._id && (
                          <div className="mt-4 space-y-3 border-t border-border pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground mr-2">Rating:</span>
                              {[1,2,3,4,5].map((n) => (
                                <button key={n} onClick={() => setEditRating(n)}>
                                  <Star className={`h-5 w-5 ${n <= editRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                </button>
                              ))}
                            </div>
                            <Input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <Input placeholder="Comment" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEdit} disabled={saving}>
                                {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : 'Save'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Reviews;


