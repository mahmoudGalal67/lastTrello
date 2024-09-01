import React, { useEffect, useState } from "react";
import NavBar from "../../components/navbar/Navbar";
import SideBar from "../../components/sideBar/SideBar";

import deletePer from "../../../public/deletePer.svg";
import restore from "../../../public/restore.svg";

import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

import "./Archeives.css";

import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import api from "../../apiAuth/auth";

function Archeives() {
  const [show, setShow] = useState(true);
  const [archeivedCard, setarcheivedCard] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeAgo = new TimeAgo("en-US");

  const { boardID } = useParams();

  const cookies = Cookies.get("token");
  useEffect(() => {
    const getWorkSpace = async () => {
      try {
        const { data } = await api({
          url: `boards/get-archived-cards/${boardID}`,
          // Authorization: `Bearer ${cookies?.token}`,
          headers: { Authorization: `Bearer ${cookies}` },
        });
        setarcheivedCard(data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getWorkSpace();
  }, [boardID]);

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
    <>
      <NavBar />
      <SideBar show={show} setShow={setShow} />

      <div style={{ overflowX: "scroll", minHeight: "100vh" }}>
        <div className="archeived-cards views">
          <div className="container">
            <table>
              <thead>
                <tr>
                  <th>Card No.</th>
                  <th>Card Title</th>
                  <th>Date</th>
                  <th>Who Deleted The card</th>
                  <th> Actions</th>
                </tr>
              </thead>
              <tbody>
                {archeivedCard.map((card, i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{card.text}</td>
                    <td>
                      {timeAgo.format(new Date() - 2 * 60 * 1000)}
                      {timeAgo.format(
                        (new Date().getTime() -
                          new Date(card.created_at).getTime()) /
                          (60 * 60 * 1000)
                      )}
                      {console.log(
                        (new Date().getTime() -
                          new Date(card.created_at).getTime()) /
                          (60 * 60 * 1000)
                      )}
                      {console.log(new Date() - 2 * 60 * 1000)}
                    </td>
                    <td>{card.user_name}</td>
                    <td>
                      <img
                        style={{
                          marginInline: "5px",
                          width: "25px",
                          height: "25px",
                        }}
                        src={deletePer}
                        alt=""
                      />
                      <img
                        style={{
                          marginInline: "5px",
                          width: "25px",
                          height: "25px",
                        }}
                        src={restore}
                        alt=""
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Archeives;
