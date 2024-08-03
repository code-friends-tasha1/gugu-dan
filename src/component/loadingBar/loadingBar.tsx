'use client';
import { Spin } from 'antd';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.7);
    z-index: 9999;
`;

const LoadingBar = () => (
  <SpinnerWrapper>
    <Spin size="large" />
  </SpinnerWrapper>
);

export default LoadingBar;
