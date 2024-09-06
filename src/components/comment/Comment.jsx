import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import ReactQuill from "react-quill";

function Comment({ comment, user }) {
  const toolbarOptions = [
    ["bold", "italic"],
    ["link", "image"],
  ];

  const module = {
    toolbar: toolbarOptions,
  };
  const [editComment, seteditComment] = useState(false);

  if (!editComment) {
    return (
      <div>
        <div className="comment-item">
          <Dropdown>
            <Dropdown.Toggle
              className="custom-dropdown-toggle p-0 no-caret"
              as="button"
            >
              <div className="user-info">
                {user.name.split(" ")[0].charAt(0).toUpperCase()}
                {"."}
                {user.name.split(" ")[1]?.charAt(0)?.toUpperCase()}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <div className="top">
                  <div className="wrapper">
                    <div className="user-info">
                      {user.name.split(" ")[0].charAt(0).toUpperCase()}
                      {"."}
                      {user.name.split(" ")[1]?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="info">
                      <div className="email">{user.name}</div>
                      <div className="email">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="bottom"></div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div
            className="comment"
            style={{ color: "white" }}
            dangerouslySetInnerHTML={{
              __html: comment.comment,
            }}
          />
        </div>
        <div className="control">
          <span onClick={() => seteditComment(true)}>Edit</span>
          <span>Delete</span>
        </div>{" "}
      </div>
    );
  } else {
    return (
      <>
        <ReactQuill theme="snow" modules={module} value={comment.comment} />
        <div
          className="wrapper"
          style={{ margin: "16px 0", flexDirection: "row" }}
        >
          <button type="submit" className="save">
            Save
          </button>
          <button
            name="desc"
            onClick={() => seteditComment(false)}
            className="cancel"
          >
            Cancel
          </button>
        </div>
      </>
    );
  }
}

export default Comment;
