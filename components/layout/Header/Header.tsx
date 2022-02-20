import Link from 'next/link';
import React from 'react'
import styled from 'styled-components';
import { UseAppContext } from '../../../hooks/use-app-context'

type Props = {}

export function Header({ }: Props) {

  const { user } = UseAppContext();

  return (
    <NavContainer className="navbar navbar-dark bg-primary sticky-top">

      <div className="d-flex w-100 justify-content-center align-items-center">
        <div>
          <div className="d-flex justify-content-center align-items-center">
            <Link href="/">
              <div className="brand cursor-pointer">

              </div>
            </Link>
            <div className="d-none d-sm-block">
              <div className="d-flex justify-content-center align-items-center items-page">
                <div className='nav-item'>Home</div>
                <div className='nav-item'>Trending</div>
                <div className='nav-item selected'>Hot</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow-1">

          <div className="search-container d-none d-sm-block">
            <input className="search-input" placeholder='Search...'></input>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-center align-items-center">

            <NavIcon className="d-none d-sm-block" image="/images/nav-icons/users.svg" />
            <NavIcon className="d-none d-sm-block" image="/images/nav-icons/comment-alt.svg" />
            <NavIcon className="d-none d-sm-block" image="/images/nav-icons/bell.svg" />
            <div className='space-user d-none d-sm-block'></div>
            <UserThumbnail image={user.picture.thumbnail} />
          </div>
        </div>
      </div>

    </NavContainer>
  )
}

const NavContainer = styled.nav`
  padding: 0px 20px !important;
  height: 80px;
  overflow: hidden;

  .search-container {
     text-align: center;
  }
  .items-page{
    margin-left: 20px;
    .nav-item {
      color: #FFF;
      padding: 0px 10px;
      opacity: 0.4;
    }
    .nav-item.selected {
      opacity: 1;
    }
  }

  .search-input{
    padding: 10px 20px;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    background: rgba(0,0,0,0.15) !important;
    color:rgba(255,255,255, 0.5) !important;
    border: none !important;
    outline: none;
  }
  .search-input:focus{
    border: none !important;    
  }

  .search-input::placeholder {
    color: rgba(255,255,255, 0.5) !important;
  }

  .space-user{
    margin-left: 20px;
    margin-right: 30px;
    height: 30px;
    width: 1px;
    background-color: rgba(255,255,255, 0.12);
  }

  .brand {
    width: 45px;
    height: 45px;
    background-image: url('/logo.png');
    background-size: contain;
    background-repeat:no-repeat;
  }
`



export const UserThumbnail = styled.div<any>`
  width: ${props => props.size || "42px"};
  height: ${props => props.size || "42px"};
  border-radius: 100%;
  background-image: url('${props => props.image}');
  background-size: contain;
  background-repeat:no-repeat;
  padding: 2px;
  border: 2px solid white;
`

const NavIcon = styled.div<any>`
  width: 24px;
  height: 24px;
  background-color: white;
  -webkit-mask-image: url('${props => props.image}');
  mask-image:url('${props => props.image}');
  mask-size: contain;
  opacity: ${props => props.selected ? 1 : 0.5};
  margin: 0px 10px;
`