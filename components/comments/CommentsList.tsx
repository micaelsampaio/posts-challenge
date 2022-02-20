import React from 'react';
import { CommentData } from '../../services/comments.service';
import { CommentRow } from './CommentRow';

export const CommentsList = ({ comments }: any) => {

  if (!comments || comments.length == 0) return null;

  return <div>
    {
      comments.map((comment: CommentData) => <CommentRow className='pt-3' key={comment.id} data={comment} />)
    }

  </div>
}
