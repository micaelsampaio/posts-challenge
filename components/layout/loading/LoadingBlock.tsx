import React, { FunctionComponent } from "react"
import styled from "styled-components"

type Props = {
  loading: boolean
}

export const LoadingBlock: FunctionComponent<Props> = ({ loading = false, children }) => {
  return <LoadingContainer className={loading ? 'loading' : ''}>
    {children}

    <LoadingLayer />
  </LoadingContainer>
}

const LoadingLayer = styled.div`
  background:rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`

const LoadingContainer = styled.div`
  position: relative;

  &.loading{
    opacity: 0.5f;
  }

  & > ${LoadingLayer}{
    display: none;
  }

  &.loading ${LoadingLayer}{
    display: block;
  }
`