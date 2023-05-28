import css from "./MobileRegistrationPage.module.css";
import MobileRegistrationForm from "../../components/MobileRegistrationForm/MobileRegistrationForm.jsx"
import sprite from "../../assets/icon/sprite.svg";
import { Link } from "react-router-dom";

const MobileRegistrationPage = () => {

    return (
        <>
            <div className={css.container}>
                <h1 className={css.title}>
                    <svg className={css.icon}>
                        <use xlinkHref={`${sprite}#wallet`} />
                    </svg>
                    Wallet
                </h1>
                <MobileRegistrationForm />
                <button type="button" className={css.button}>
                    <Link to="/login">Log in</Link></button>
            </div>
        </>
    );
};

export default MobileRegistrationPage;