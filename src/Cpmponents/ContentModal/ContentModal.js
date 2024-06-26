import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Carousel from "../Carousel/Carousel";
// import {
//   img_500,
//   unavailable,
//   unavailableLandscape,
// } from "../../confog/Config"; // Ensure the path is correct
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/Config";
import "./ContentModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "#39445a",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling
};

export default function ContentModal({ children, media_type, id }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [content, setContent] = useState(null);
  const [video, setVideo] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setContent(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setVideo(data.results[0]?.key);
    } catch (error) {
      console.error("Failed to fetch video:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <div
          className="media"
          style={{ cursor: "pointer" }}
          color="inherit"
          onClick={handleOpen}
        >
          {children}
        </div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
              {content && (
                <div className="main-img">
                  <div className="contentModal">
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <img
                            src={
                              content.poster_path
                                ? `${img_500}/${content.poster_path}`
                                : unavailable
                            }
                            alt={content.name || content.title}
                            className="ContentModal__portrait"
                          />
                          <img
                            src={
                              content.backdrop_path
                                ? `${img_500}/${content.backdrop_path}`
                                : unavailableLandscape
                            }
                            alt={content.name || content.title}
                            className="ContentModal__landscape"
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="ContentModal__about">
                            <span className="ContentModal__title">
                              {content.name || content.title} (
                              {(
                                content.first_air_date ||
                                content.release_date ||
                                "-----"
                              ).substring(0, 4)}
                              )
                            </span>
                            {content.tagline && (
                              <i className="tagline">{content.tagline}</i>
                            )}

                            <span className="ContentModal__description">
                              {content.overview}
                            </span>
                            <div>
                              <Carousel media_type={media_type} id={id} />
                            </div>
                            <Button
                              variant="contained"
                              startIcon={<YouTubeIcon />}
                              color="secondary"
                              target="__blank"
                              href={`https://www.youtube.com/watch?v=${video}`}
                            >
                              Watch the Trailer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}
