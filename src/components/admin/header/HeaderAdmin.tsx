import {HeaderData} from "../data/admin.data.ts";
import {AdminPanelProps} from "../interfaces/admin.props.ts";
import styled from "../Admin.module.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
const HeaderAdmin = () =>{
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigate = useNavigate();

    const handleClick = (src:string) => {
        navigate(src);
        setIsMenuOpen(!isMenuOpen);

    };
    return(
        <>
            <button className={styled.burgerIcon} onClick={toggleMenu}>
                ☰
            </button>
            <div className={`${styled.adminHC} ${isMenuOpen ? styled.open : ""}`}>
                <div className={styled.adminHCD}>
                    {HeaderData?.length && HeaderData.map((item: AdminPanelProps) => (
                        <div key={item.id} onClick={() => handleClick(item.link)}>{item.name}</div>
                    ))}
                </div>

            </div>
        </>
    )

}
export default HeaderAdmin;