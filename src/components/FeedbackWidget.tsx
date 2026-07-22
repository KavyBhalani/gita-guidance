"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function FeedbackWidget() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "site_feedback"), {
        rating,
        message,
        userId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center max-w-sm">
        <p className="text-primary font-medium">Thank you for your feedback!</p>
        <p className="text-foreground/60 text-sm mt-1">Your insights help us improve.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      <h4 className="text-foreground font-semibold mb-3">Rate your experience</h4>
      
      {!showForm ? (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-primary text-primary"
                    : "text-foreground/20 hover:text-primary/50"
                }`}
              />
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-foreground/20"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us how we can improve (optional)..."
            className="w-full px-3 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary/50 resize-none h-20"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setRating(0);
                setMessage("");
              }}
              className="px-4 py-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
