import React, { useState } from 'react';
import { useAuth } from '../../app/AuthContext';

interface CommentItemProps {
  comment: any;
  onEdit: (data: { id: string; content: string }) => void;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = user && Number(user.id) === comment.userId;

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }
    onEdit({ id: comment._id, content: trimmed });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <div className={`comment-item${comment.parentId ? ' comment-item--reply' : ''}`}>
      <div className="comment-item__header">
        <span className="comment-item__author">{comment.userName}</span>
        <span className="comment-item__date">
          {new Date(comment.createdAt).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {comment.isEdited && <span className="comment-item__edited"> (editado)</span>}
        </span>
      </div>

      {isEditing ? (
        <div className="comment-item__edit">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <div className="comment-item__edit-actions">
            <button className="comment-item__btn-save" onClick={handleSave}>Guardar</button>
            <button className="comment-item__btn-cancel" onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      ) : (
        <p className="comment-item__content">{comment.content}</p>
      )}

      {isOwner && !isEditing && (
        <div className="comment-item__actions">
          <button className="comment-item__btn" onClick={() => setIsEditing(true)}>Editar</button>
          <button className="comment-item__btn comment-item__btn--delete" onClick={() => onDelete(comment._id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
