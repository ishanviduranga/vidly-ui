import React from "react";

const ListGroup = (props) => {
  const { items, textProperty, valueProperty, selectedItem, onClick } = props;

  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          className={
            item[valueProperty] === selectedItem[valueProperty]
              ? "list-group-item active"
              : "list-group-item"
          }
          style={{ cursor: "pointer" }}
          key={item[valueProperty] ? item[valueProperty] : "id_u"}
          onClick={() => onClick(item)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
