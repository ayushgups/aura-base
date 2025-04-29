import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheck, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import './ReviewNotifications.css';

const ReviewNotifications = ({ groupName, userId }) => {
  const { userid } = useParams();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (groupName && userid) {
      fetchPendingReviews();
    }
  }, [groupName, userid]);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/pending-reviews?group_id=${encodeURIComponent(groupName)}&user_id=${encodeURIComponent(userid)}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error('Failed to fetch pending reviews');
      }
      const data = await response.json();
      
      // Ensure data is an array
      setPendingReviews(Array.isArray(data) ? data : []);
      setCurrentIndex(0); // Reset to first review when new data arrives
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      setPendingReviews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (pendingId, isApproved) => {
    try {
      const response = await fetch('http://localhost:5001/api/review-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pendingId,
          eventId: currentReview.event_id,
          isApproved,
          groupId: groupName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      // Remove the reviewed item from the local state
      setPendingReviews(prevReviews => prevReviews.filter(review => review.pending_id !== pendingId));
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, pendingReviews.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (!groupName || !userid) {
    return <div>Missing required information</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pendingReviews.length === 0) {
    return (
      <Card className="text-center p-4">
        <Card.Text>No pending reviews</Card.Text>
      </Card>
    );
  }

  const currentReview = pendingReviews[currentIndex];

  return (
    <div className="review-notifications-container">
      <h4 className="mb-4">Review Notifications ({currentIndex + 1}/{pendingReviews.length})</h4>
      <Card className="review-notifications mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Review Request</h5>
            <small className="text-muted">From: {currentReview.name_of_nominee}</small>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="notification-content">
            <div className={`aura-change mb-2 ${currentReview.events.aura_points >= 0 ? 'text-success' : 'text-danger'}`}>
              {currentReview.events.aura_points > 0 ? '+' : ''}{currentReview.events.aura_points} Aura
            </div>
            <p className="notification-text mb-3">
              {currentReview.events.description}
            </p>
            <div className="d-flex gap-2 mb-3">
              <Button 
                variant="success" 
                className="flex-grow-1"
                onClick={() => handleReview(currentReview.pending_id, true)}
              >
                <FaCheck className="me-2" />
                Approve
              </Button>
              <Button 
                variant="danger" 
                className="flex-grow-1"
                onClick={() => handleReview(currentReview.pending_id, false)}
              >
                <FaTimes className="me-2" />
                Deny
              </Button>
            </div>
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <FaChevronLeft /> Previous
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === pendingReviews.length - 1}
              >
                Next <FaChevronRight />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewNotifications;