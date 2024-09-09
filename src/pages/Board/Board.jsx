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

  const [postion, setpostion] = useState(null);

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

  const onDrop = async (newList, place) => {
    setboard((prev) => ({
      ...prev,
      lists_of_the_board: [
        ...prev.lists_of_the_board.map((list, i) => {
          if (list.id == newList && postion.prevList != newList) {
            list.cards_of_the_list.splice(place - 1, 0, postion.card);
            return {
              ...list,
              cards_of_the_list: list.cards_of_the_list,
            };
          } else if (
            list.id == postion.prevList &&
            postion.prevList != newList
          ) {
            return {
              ...list,
              cards_of_the_list: list.cards_of_the_list.filter(
                (card) => card.id != postion.card.id
              ),
            };
          } else if (
            list.id == postion.prevList &&
            postion.prevList == newList
          ) {
            const cards = list.cards_of_the_list.filter(
              (card) => card.id != postion.card.id
            );
            cards.splice(
              postion.index > place - 2 ? place - 1 : place - 2,
              0,
              postion.card
            );
            return {
              ...list,
              cards_of_the_list: cards,
            };
          } else {
            return list;
          }
        }),
      ],
    }));

    try {
      const response = await api({
        url: `cards/move-card/${postion.card.id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies}`,
          "Content-Type": "multipart/form-data",
        },
        data: {
          the_list_id: newList,
          position:
            postion.index <= place - 2 && postion.prevList == newList
              ? place - 1
              : place,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

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
        backgroundImage: board.photo
          ? `url(https://back.alyoumsa.com/public/storage/${board.photo})`
          : "url(/photo-1675981004510-4ec798f42006.jpg)",
        backgroundSize: "cover",
      }}
    >
      <Navbar setShow={setShow} />
      <SideBar show={show} setShow={setShow} />
      <div className="wrapper views">
        <div className="board-options">
          <span>{board.name}</span>
        </div>
        <div className="wrapper-lists">
          {board.lists_of_the_board.map((list) => (
            <List
              key={list.id}
              list={list}
              boardId={Number(boardId)}
              setboard={setboard}
              board={board}
              setShow={setShow}
              onDrop={onDrop}
              setpostion={setpostion}
              position={postion}
            />
          ))}

          <AddList setShow={setShow} boardId={board.id} setboard={setboard} />
        </div>
      </div>
    </div>
  );
}

export default Board;
