import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
    type: "text",
    size: props.small ? 5 : undefined
}))`
  height: 32px;
  width:50px;
  border-radius: 3px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  border: 1px solid #e5e5e5;
  padding: 1000 32px 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;




const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
      margin-right: auto;

`;

const FilterComponent = ({filterText, onFilter, onClear}) => (
    <>
        <Input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={filterText}
            onChange={onFilter}
        />
        <ClearButton onClick={onClear}>X</ClearButton>
    </>
);

export default FilterComponent;
