import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    container: {
        background: ColorEnum.LightGrey,
        height: "100%",
        borderLeft: 1,
        borderLeftStyle: "solid",
        borderColor: ColorEnum.LighterGrey,
        WebkitTransition: "width .5s ease-in-out",
        MozTransition: "width .5s ease-in-out",
        OTransition: "width .5s ease-in-out",
        transition: "width .5s ease-in-out",
        overflow: "hidden",
    },
    open: {
        width: 400,
    },
    closed: {
        width: 0,
    },
    header: {
        height: 60,
        padding: "20px 20px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: 1,
        borderBottomStyle: "solid",
        borderBottomColor: ColorEnum.LighterGrey,
        background: ColorEnum.White,
    },
    footer: {
        padding: 10,
        border: 0,
        alignItems: "center",
    },
});
