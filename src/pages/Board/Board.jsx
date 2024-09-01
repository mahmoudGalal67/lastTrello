import "../../App.css";
import "./Board.css";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar";
import AddList from "../../components/addList/AddList";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import List from "../../components/List/List";
import SideBar from "../../components/sideBar/SideBar";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";
import api from "../../apiAuth/auth";

function Board() {
  const [show, setShow] = useState(true);

  const [loading, setLoading] = useState(true);
  const [board, setboard] = useState({});
  const { boardId } = useParams();

  const cookies = Cookies.get("token");

  useEffect(() => {
    const getBoard = async () => {
      try {
        const { data } = await api({
          url: `boards/get-board/${boardId}`,
          headers: { Authorization: `Bearer ${cookies}` },
        });
        setboard(data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getBoard();
  }, [boardId]);

  useEffect(() => {
    if (!show) {
      document.querySelector(".views")?.classList.add("large");
    } else {
      document.querySelector(".views")?.classList.remove("large");
    }
  }, [show]);

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
    <div
      className="boards"
      style={{
        backgroundImage: board.board_background
          ? `url(https://back.alyoumsa.com/public/storage/${board.board_background})`
          : "url(/photo-1675981004510-4ec798f42006.jpg)",
        backgroundSize: "cover",
      }}
    >
      <Navbar setShow={setShow} />
      <SideBar show={show} setShow={setShow} />
      <div className="wrapper views">
        <div className="board-options">
          <span>{board.board_name}</span>
        </div>
        <div className="wrapper-lists">
          {board.lists_of_the_board.map((list) => (
            <List
              key={list.list_id}
              list={list}
              boardId={Number(boardId)}
              setboard={setboard}
              board={board}
            />
          ))}

          <AddList boardId={board.board_id} setboard={setboard} />
        </div>
      </div>
    </div>
  );
}

export default Board;
