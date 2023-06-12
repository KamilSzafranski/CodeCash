import css from "./Dropdown.module.css";
import sprite from "../../assets/icon/sprite.svg";
import clsx from "clsx";
import { useEffect, useRef } from "react";

const Dropdown = ({ selectedName, handleDate, children }) => {
  const grid = useRef();
  const arrow = useRef();
  const wrapper = useRef();

  const handleHidden = (event) => {
    event.preventDefault();
    console.log("e");
    if (grid.current.children.length === 0) return;

    grid.current.classList.toggle(css.hidden);
    arrow.current.classList.toggle(css.up);
  };

  useEffect(() => {
    const handleRemoveHidden = (event) => {
      if (!grid.current || !arrow.current) return;
      if (
        event.target !== wrapper.current &&
        event.target !== wrapper.current.children[0] &&
        event.target !== wrapper.current.children[1]
      ) {
        grid.current.classList.add(css.hidden);
        arrow.current.classList.add(css.up);
      }
    };

    window.addEventListener("click", handleRemoveHidden);

    return () => window.removeEventListener("click", handleRemoveHidden);
  }, []);

  return (
    <>
      <div className={css.wrapper} ref={wrapper} onClick={handleHidden}>
        <span>{selectedName}</span>
        <svg className={clsx(css.icon, css.up)} ref={arrow}>
          <use xlinkHref={`${sprite}#${"arrow"}`}></use>
        </svg>
        <ul
          ref={grid}
          className={clsx(css.grid, css.hidden)}
          onClick={handleDate}
        >
          {children}
        </ul>
      </div>
    </>
  );
};

export default Dropdown;
