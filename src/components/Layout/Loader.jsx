/** @format */

import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="cell d-0" />
        <div className="cell d-1" />
        <div className="cell d-2" />
        <div className="cell d-1" />
        <div className="cell d-2" />
        <div className="cell d-2" />
        <div className="cell d-3" />
        <div className="cell d-3" />
        <div className="cell d-4" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    --cell-size: 52px;
    --cell-spacing: 1px;
    --cells: 3;
    --total-size: calc(
      var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing))
    );
    display: flex;
    flex-wrap: wrap;
    width: var(--total-size);
    height: var(--total-size);
  }

  .cell {
    flex: 0 0 var(--cell-size);
    margin: var(--cell-spacing);
    background-color: transparent;
    box-sizing: border-box;
    border-radius: 4px;
    animation: 1.5s ripple ease infinite;
  }

  .cell.d-1 {
    animation-delay: 100ms;
  }
  .cell.d-2 {
    animation-delay: 200ms;
  }
  .cell.d-3 {
    animation-delay: 300ms;
  }
  .cell.d-4 {
    animation-delay: 400ms;
  }

  /* Updated Colors */
  .cell:nth-child(1) {
    --cell-color: rgba(0, 31, 240, 0.85);
  }
  .cell:nth-child(2) {
    --cell-color: rgba(0, 31, 240, 0.75);
  }
  .cell:nth-child(3) {
    --cell-color: rgba(0, 31, 240, 0.65);
  }
  .cell:nth-child(4) {
    --cell-color: rgba(0, 31, 240, 0.55);
  }
  .cell:nth-child(5) {
    --cell-color: rgba(0, 31, 240, 0.45);
  }
  .cell:nth-child(6) {
    --cell-color: rgba(0, 31, 240, 0.35);
  }
  .cell:nth-child(7) {
    --cell-color: rgba(0, 31, 240, 0.25);
  }
  .cell:nth-child(8) {
    --cell-color: rgba(0, 31, 240, 0.15);
  }
  .cell:nth-child(9) {
    --cell-color: rgba(0, 31, 240, 0.05);
  }

  /* Animation */
  @keyframes ripple {
    0% {
      background-color: transparent;
    }
    30% {
      background-color: var(--cell-color);
    }
    60% {
      background-color: transparent;
    }
    100% {
      background-color: transparent;
    }
  }
`;

export default Loader;
