import React from 'react'
import styled from 'styled-components'

export const NavItemIcon = styled.div`
  width: 30px;
  height: 30px;
  opacity: 0.5;
  background: #FFF;
  background-position: center;
  background-size: contain;

  &.active{
    opacity: 1;
  }
`