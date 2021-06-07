import React from "react";
import s from "./AboutMe.module.css";
import img from "../../assets/img/myPoto1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";

export default function AboutMe() {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <span>Yuriy Protsyk</span>
        <div className={s.img}>
          <img src={img} width="120px" />
        </div>
      </div>
      <div className={s.content}>
        <div className={s.title}>
          <FontAwesomeIcon icon={faAddressCard} />
          <span>Contacts</span>
        </div>
        <ul>
          <li>
            <b>Email: </b>
            <a>yura.04.27@gmail.com</a>
          </li>
          <li>
            <b>Facebook: </b>
            <a target="_blank" href="https://www.facebook.com/protsyk.yuriy/">
              https://www.facebook.com/protsyk.yuriy/
            </a>
          </li>
          <li>
            <b>LinkedIn: </b>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/yura-protsyk-a096581ba/"
            >
              https://www.linkedin.com/in/yura-protsyk-a096581ba/
            </a>
          </li>
          <li>
            <b>GitHub: </b>
            <a target="_blank" href="https://github.com/Yura0427">
              https://github.com/Yura0427
            </a>
          </li>
          <li>
            <b>Phone</b> (
            <a href="viber://chat?number=%2B380637009892">Viber</a>,
            <a href="tg://resolve?domain=Yuriy_Protsyk">Telegram</a>)
            <b>:</b>
            <a href="tel:+380637009892"> +380 63 700 9892 </a>
          </li>
        </ul>
        <div className={s.title}>
          <FontAwesomeIcon icon={faSortAmountDown} />
          <span>Skills</span>
        </div>
        <ul>
          <li>HTML5/CSS3</li>
          <li>JavaScript</li>
          <li>React</li>
          <li>Redux</li>
          <li>Firebase</li>
          <li>Git</li>
          <li>Bootstrap</li>
          <li>Angular</li>
          <li>jQuery</li>
        </ul>
        <div className={s.title}>
          <FontAwesomeIcon icon={faUniversity} />
          <span>Education and courses</span>
        </div>
        <ul>
          <li>НУ"ЛП" /2001-2005 /Інститут енергетики та систем керування.</li>
          <li>"Logos IT Academy" /2020 /Front-end Developer</li>
          <li>Self-education /2021 </li>
        </ul>
      </div>
    </div>
  );
}
