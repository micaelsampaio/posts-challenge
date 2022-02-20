import React, { memo } from 'react'
import styled from 'styled-components';

export const Footer = memo(() => {
  return (
    <FooterContainer>

      <div className="card mt-2">
        <div className="card-body">
          <h5>Best Posts</h5>

          <div className="best-post">
            <div className="image"></div>
            <div className="user">Username 1</div>
          </div>

          <div className="best-post">
            <div className="image"></div>
            <div className="user">Username 2</div>
          </div>

          <div className="best-post">
            <div className="image"></div>
            <div className="user">Username 3</div>
          </div>

          <div className="best-post">
            <div className="image"></div>
            <div className="user">Username 4</div>
          </div>

          <div className="text-muted text-centeres mt-4">Post Challenge 2022</div>
        </div>
      </div>

    </FooterContainer>
  )
});

const FooterContainer = styled.footer`
    .best-post{
        margin-bottom: 20px;  

        .image{
          width: 150px;
          height: 100px;
          background-color: #CCC;
        }
        .user {
          font-size: 1rem;
        }
        
    }
`
