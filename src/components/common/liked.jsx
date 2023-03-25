import React from "react";

const Liked = ({liked, onClick}) => {
  return (
    <i
      className={liked ? "fa fa-heart" : "fa fa-heart-o"}
      style={{cursor: "pointer"}}
      onClick={onClick}
      aria-hidden="true"
    ></i>
  );
}
 
export default Liked;