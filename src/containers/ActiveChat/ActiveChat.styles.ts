import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    container: {
        background: ColorEnum.LightGrey,
        height: "100%",
    },
    header: {
        height: 60,
        padding: "20px 20px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: ColorEnum.White,
        borderBottom: 1,
        borderBottomStyle: "solid",
        borderBottomColor: ColorEnum.LighterGrey,
    },
    content: {
        height: "calc(100% - 100px)",
        overflow: "auto",
    },
    footer: {
        padding: 10,
        border: 0,
        alignItems: "center",
    },
    yellow: {
        color: "#FFA500",
    },
    pointer: {
        cursor: "pointer",
    },
});
