import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import Cookies from "js-cookie";

import group from "../../../public/group.svg";
import table from "../../../public/table.svg";
import date from "../../../public/date.svg";
import removedUsers from "../../../public/removedUsers.svg";

import "./SideBar.css";
import { Link, useParams } from "react-router-dom";
import api from "../../apiAuth/auth";
import Spinner from "react-bootstrap/esm/Spinner";

function SideBar({ show, setShow }) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(true);
  const [workSpace, setworkSpace] = useState(null);
  const [showUsers, setShowUsers] = useState(false); // State to control user list visibility
  const [users, setUsers] = useState([]);

  const { workspaceId, boardId } = useParams();

  const cookies = Cookies.get("token");
  useEffect(() => {
    if (workspaceId) {
      const getWorkSpace = async () => {
        try {
          const { data } = await api({
            url: `workspaces/get-workspace/${workspaceId}`,
            // Authorization: `Bearer ${cookies?.token}`,
            headers: { Authorization: `Bearer ${cookies}` },
          });
          setworkSpace(data.result);
          if (workspaceId && !boardId) {
            setUsers(data.result.users);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      };
      getWorkSpace();
    }

    if (boardId) {
      const getBoarrdUsers = async () => {
        try {
          const { data } = await api({
            url: `boards/get-board/${boardId}`,
            // Authorization: `Bearer ${cookies?.token}`,
            headers: { Authorization: `Bearer ${cookies}` },
          });
          setUsers(data.data.users);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      };
      getBoarrdUsers();
    } else {
      setLoading(false);
    }
  }, [boardId]);

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center position-fixed top-0 left-0">
        <Spinner animation="border" role="status" variant="primary" size="md">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Button className="sideNav-link" variant="primary" onClick={handleShow}>
        <img src="/rightArrow.svg" alt="" />
      </Button>

      <div className="side-bar"></div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          {workSpace ? (
            <Offcanvas.Title>
              <img src="/photo-1675981004510-4ec798f42006.jpg" alt="" />
              {workSpace.workspace_name}
            </Offcanvas.Title>
          ) : (
            <img
              src="/logo.gif"
              style={{
                width: "80px",
                height: "30px",
                objectFit: "contain",
                borderRadius: "5px",
                marginLeft: "15px",
              }}
              alt=""
            />
          )}
        </Offcanvas.Header>
        <Offcanvas.Body>
          {workspaceId && (
            <a
              href="#"
              className="board-item"
              onClick={(e) => {
                e.preventDefault();
                setShowUsers((prev) => !prev);
              }}
            >
              <img src={group} alt="" />

              <span>Members</span>
            </a>
          )}
          {showUsers && (
            <div className="users-list">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.user_id} className="board-item">
                    <span>
                      {user.user_name} ({user.email})
                    </span>
                  </div>
                ))
              ) : (
                <p>No members found.</p>
              )}
            </div>
          )}
          <a href="#" className="board-item">
            <img src={table} alt="" />
            <span>Table</span>
          </a>
          <a href="#" className="board-item">
            <img src={date} alt="" />
            <span>Calender</span>
          </a>
          {workspaceId && boardId && (
            <Link to={`/archeivedCards/${boardId}`} className="board-item">
              <img src={removedUsers} alt="" />
              <span>Archive</span>
            </Link>
          )}
          {workSpace && <h2>Your Boards</h2>}
          {workSpace &&
            workSpace.boards_of_the_workspace.map((board) => (
              <Link
                key={board.board_id}
                to={`/board/${workSpace.workspace_id}/${board.board_id}`}
                className="board-item"
              >
                <img
                  src={
                    board.board_background
                      ? `https://back.alyoumsa.com/public/storage/${board.board_background}`
                      : "/photo-1675981004510-4ec798f42006.jpg"
                  }
                  alt=""
                />
                <span>{board.board_name} </span>
              </Link>
            ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideBar;
