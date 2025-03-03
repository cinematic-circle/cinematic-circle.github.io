import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./mainPage.css";
import gsap from "gsap";
import { useMediaQuery } from "./contexts/MediaQueryContext";

function MainPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState("home");
  const [emailCopied, setEmailCopied] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [hasAboutAnimated, setHasAboutAnimated] = useState(false);
  const [hasPortfolioAnimated, setHasPortfolioAnimated] = useState(false);
  const [hasContactAnimated, setHasContactAnimated] = useState(false);

  const { matchedDevice } = useMediaQuery();
  const isMobile = matchedDevice.includes("mobile");
  const isTablet = matchedDevice.includes("tablet");

  const studioInk = require("./assets/auroraInk.mp4");
  const drink = require("./assets/drink.mp4");
  const concert = require("./assets/concert.mp4");
  const cclogo = require("./assets/cclogo.png");

  const media = [
    {
      type: "video",
      src: concert,
    },
    {
      type: "video",
      src: studioInk,
    },
    {
      type: "video",
      src: drink,
    },
  ];

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const startyX = -screenWidth / 4;

    if (isVideoReady) {
      gsap.fromTo(
        ".textOne",
        { x: startyX },
        { duration: 3, x: 0, ease: "slow" }
      );
      gsap.fromTo(
        ".textTwo",
        { x: startyX },
        { duration: 3, x: 0, ease: "slow" }
      );
    }

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const scrollPosition = scrollContainerRef.current.scrollTop;
      const aboutPosition = aboutRef.current?.offsetTop || 0;
      const portfolioPosition = portfolioRef.current?.offsetTop || 0;
      const contactPosition = contactRef.current?.offsetTop || 0;
      const halfWindowHeight = window.innerHeight / 2;

      if (
        scrollPosition >= portfolioPosition - halfWindowHeight &&
        scrollPosition < contactPosition
      ) {
        setCurrentPage("portfolio");
        if (!hasPortfolioAnimated) {
          setIsPortfolioVisible(true);
          setHasPortfolioAnimated(true);
        }
      } else if (scrollPosition >= contactPosition - halfWindowHeight) {
        setCurrentPage("contact");
        if (!hasContactAnimated) {
          setIsContactVisible(true);
          setHasContactAnimated(true);
        }
      } else if (scrollPosition >= aboutPosition - halfWindowHeight) {
        setCurrentPage("about");
        if (!hasAboutAnimated) {
          setIsAboutVisible(true);
          setHasAboutAnimated(true);
        }
      } else {
        setCurrentPage("home");
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    handleScroll();

    setTimeout(() => {
      scrollContainer?.addEventListener("scroll", handleScroll);
    }, 100);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    hasAboutAnimated,
    hasContactAnimated,
    hasPortfolioAnimated,
    isVideoReady,
  ]);

  const scrollToSection = (ref: any) => {
    if (scrollContainerRef.current && ref.current) {
      scrollContainerRef.current.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleClick = (page: string) => {
    if (page === "home") {
      scrollToSection(imageContainerRef);
    } else if (page === "about") {
      scrollToSection(aboutRef);
    } else if (page === "portfolio") {
      scrollToSection(portfolioRef);
    } else if (page === "contact") {
      scrollToSection(contactRef);
    }
  };
  const handleEmailCopy = () => {
    const email = "aurorainkstudio@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    });
  };

  const portfolioDelays = [0.2, 0, 0.2];

  return (
    <div className="pageWrapper">
      <div
        className={currentPage === "contact" ? "listFooter" : "listContainer"}
      >
        {["about", "portfolio", "contact"].map((section) => (
          <motion.button
            key={section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5 }}
            className={`list ${
              currentPage === section && currentPage !== "home" ? "active" : ""
            }`}
            onClick={() => handleClick(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.button>
        ))}
      </div>
      <div className="scrollContainer" ref={scrollContainerRef}>
        <div className="imageContainer scrollSection" ref={imageContainerRef}>
          {media.map((item, index) => {
            if (item.type === "image") {
              return (
                <img className="image" key={index} alt="media" src={item.src} />
              );
            }
            return null;
          })}

          {!isTablet && !isMobile
            ? media
                .filter((item) => item.type === "video")
                .slice(0, 3)
                .map((item, index) => (
                  <motion.video
                    initial={{ opacity: 0 }}
                    animate={isVideoReady ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3, duration: 3 }}
                    className="image"
                    key={index}
                    width="100%"
                    height="95%"
                    muted
                    autoPlay={true}
                    loop={true}
                    playsInline
                    onLoadedData={() => setIsVideoReady(true)}
                  >
                    <source src={item.src} type="video/mp4" />
                  </motion.video>
                ))
            : (() => {
                const videos = media.filter((item) => item.type === "video");
                const secondVideo = videos.length > 1 ? videos[1] : videos[0];
                return secondVideo ? (
                  <motion.video
                    initial={{ opacity: 0 }}
                    animate={isVideoReady ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3, duration: 3 }}
                    className="imageMobile"
                    width="100%"
                    height="100%"
                    autoPlay={true}
                    loop={true}
                    muted
                    playsInline
                    onLoadedData={() => setIsVideoReady(true)}
                  >
                    <source src={secondVideo.src} type="video/mp4" />
                  </motion.video>
                ) : null;
              })()}
          {isVideoReady && (
            <div className="textContainer">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 2 }}
                className="textOne"
              >
                <img src={cclogo} alt="logo" height={"50%"} width={"50%"} />
              </motion.div>

              {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 2 }}
                  className="textThree"
                >
                  Circle
                </motion.div> */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.5 }}
                className="textTwo"
              ></motion.div>
            </div>
          )}
        </div>
        <div ref={aboutRef} className="aboutSection scrollSection">
          {isMobile || isTablet ? (
            <div className="aboutImage">
              <motion.div
                className="aboutTextMobile"
                initial={{ opacity: 0 }}
                animate={
                  isAboutVisible ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }
                }
                transition={{ delay: 0.2, duration: 1 }}
              >
                <h2>Cinematic Circle</h2>
                <p>
                  Hey!<br></br> I'm Tilde - a passionate tattoo artist with
                  nearly 4 years of experience. <br />I specialize in Fine Line
                  tattooing, creating delicate and intricate designs with
                  precision and artistry. <br />
                  While Fine Line is my specialty, I´m always excited to take on
                  new and creative projects. <br />
                  Let’s bring your ideas to life!
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="aboutPageDesktop">
              <div className="aboutImage"></div>
              <div className="aboutTextContainer">
                <svg
                  className="bubblesAboutPage"
                  preserveAspectRatio="xMidYMid slice"
                  viewBox="10 10 80 80"
                >
                  <path
                    fill="#000"
                    className="out-bottom"
                    d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
                  />
                  <path
                    fill="#fff"
                    className="in-bottom"
                    d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
                  />
                </svg>
                <motion.div
                  className="aboutTextDesktop"
                  initial={{ opacity: 0 }}
                  animate={
                    isAboutVisible
                      ? { y: 0, opacity: 1 }
                      : { y: 40, opacity: 0 }
                  }
                  transition={{ duration: 1 }}
                >
                  <h2>Cinematic Circle</h2>
                  Hey!<br></br> I'm Tilde - a passionate tattoo artist with
                  nearly 4 years of experience. <br />I specialize in Fine Line
                  tattooing, creating delicate and intricate designs with
                  precision and artistry. <br />
                  While Fine Line is my specialty, I´m always excited to take on
                  new and creative projects. <br />
                  Let’s bring your ideas to life!
                </motion.div>
              </div>
            </div>
          )}
        </div>

        <div ref={portfolioRef} className="portfolioSection scrollSection">
          {media.map((item, index) => {
            const delay = portfolioDelays[index] || 0;
            if (item.type === "image") {
              return (
                <img
                  className="portfolioImage"
                  key={index}
                  alt="media"
                  src={item.src}
                />
              );
            } else if (item.type === "video") {
              return !isMobile ? (
                <motion.video
                  initial={{ opacity: 1 }}
                  animate={
                    isPortfolioVisible ? { height: "85%" } : { height: "0%" }
                  }
                  transition={{ delay: delay, duration: 2 }}
                  className="portfolioImage"
                  key={index}
                  width="100%"
                  height="100%"
                  muted
                  autoPlay={true}
                  loop={true}
                  playsInline
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              ) : (
                <motion.video
                  initial={{ opacity: 1 }}
                  animate={
                    isPortfolioVisible ? { height: "33%" } : { height: "0%" }
                  }
                  transition={{ delay: delay, duration: 2 }}
                  className="portfolioImage"
                  key={index}
                  width="100%"
                  height="100%"
                  autoPlay={true}
                  loop={true}
                  muted
                  playsInline
                >
                  <source src={item.src} type="video/mp4" />
                </motion.video>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div ref={contactRef} className="contactSection scrollSection">
          <motion.div
            className="contactText"
            initial={{ opacity: 0 }}
            animate={isContactVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h2>Contact Me</h2>
            <p>
              Get in touch with me through email for future business
              collaborations, such as renting a place in my studio.
            </p>
            <button
              className={`emailButton ${emailCopied ? "copied" : ""}`}
              onClick={handleEmailCopy}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width={50}
                height={50}
              >
                <path d="M64 27a1 1 0 0 0-.35-.77L57 20.66V6a1 1 0 0 0-1-1H38.32L32.64.23a1 1 0 0 0-1.29 0L25.67 5H8a1 1 0 0 0-1 1v14.66L.36 26.23A1 1 0 0 0 0 27v36a1 1 0 0 0 1 1h62a1 1 0 0 0 1-1V27zm-7-3.73 4.27 3.58L57 29.33zm-25-21L35.21 5h-6.42zM9 7h46v23.49L32 43.84 9 30.49zM7 23.27v6.05l-4.27-2.47zm-5 5.47 20.15 11.7L2 60.59zM3.41 62l20.53-20.52 7.56 4.39a1 1 0 0 0 1 0l7.56-4.39L60.59 62zM62 60.59 41.85 40.44 62 28.74z" />
                <path d="M46 24a14 14 0 1 0-14 14 14 14 0 0 0 14-14zm-26 0a12 12 0 1 1 12 12 12 12 0 0 1-12-12zM11 10v4h2v-3h3V9h-4a1 1 0 0 0-1 1zM11 16h2v2h-2z" />
                <path d="M36 21a4 4 0 0 1-4 4 2 2 0 0 0-2 2v2h2v-2a6 6 0 1 0-6-6h2a4 4 0 0 1 8 0zM30 31h2v2h-2z" />
              </svg>
              <span className="linkCopiedText">Email copied</span>
            </button>
            <h2>Booking tattoo appointment</h2>
            <p>
              To book an appointment for a tattoo with me, please click forward
              to my instagram page and send me a message.
            </p>
            <a
              href="https://www.instagram.com/aurorainkstudio/"
              className="instagramButton"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="50"
                height="50"
                viewBox="0 0 50 50"
              >
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
              </svg>
            </a>
          </motion.div>
          <svg
            className="bubblesBackground"
            preserveAspectRatio="xMidYMid slice"
            viewBox="10 10 80 80"
          >
            <path
              fill="#000"
              className="out-top"
              d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
            />
            <path
              fill="#fff"
              className="in-top"
              d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
            />
            <path
              fill="#000"
              className="out-bottom"
              d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
            />
            <path
              fill="#fff"
              className="in-bottom"
              d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
            />
          </svg>
          <footer className="footer">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isContactVisible ? { y: 0, opacity: 1 } : { y: -30 }}
              transition={{ duration: 1 }}
              className="footerText"
            >
              Aurora Ink Studio ©
            </motion.div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
