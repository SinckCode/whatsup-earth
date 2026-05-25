import React, { useState } from 'react';
import { useAuth } from '../../app/AuthContext';
import { useComments } from '../../hooks/useComments';
import { useEventStats } from '../../hooks/useEventStats';
import CommentItem from './CommentItem';
import '../../styles/components/CommentSection.scss';

interface CommentSectionProps {
  eventId: string;
}

export default function CommentSection({ eventId }: CommentSectionProps) {
  const { user } = useAuth();
  const { comments, isLoading, createComment, updateComment, deleteComment } = useComments(eventId);
  const { stats } = useEventStats(eventId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;
    createComment({ eventId, content: trimmed });
    setNewComment('');
  };

  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h3>Comentarios ({stats.commentCount})</h3>
        <div className="comment-section__stats">
          <span title="Vistas">👁 {stats.viewCount}</span>
          <span title="Favoritos">⭐ {stats.favoriteCount}</span>
        </div>
      </div>

      {user && (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <textarea
            className="comment-section__input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            maxLength={1000}
            rows={3}
          />
          <button
            className="comment-section__btn-submit"
            type="submit"
            disabled={!newComment.trim()}
          >
            Comentar
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="comment-section__loading">Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p className="comment-section__empty">No hay comentarios aún</p>
      ) : (
        <div className="comment-section__list">
          {comments.map((c: any) => (
            <CommentItem
              key={c._id}
              comment={c}
              onEdit={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
