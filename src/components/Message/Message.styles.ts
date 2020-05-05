import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    container: {
        display: "flex",
        margin: "10px 20px",
    },
    bold: {
        color: "#000",
        fontWeight: "bold",
    },
    avatar: {
        background: "#3498FF",
    },
    message: {
        background: "#FFF",
        padding: "5px 10px",
        fontSize: 12,
        marginLeft: 10,
        width: "100%",
        borderRadius: 4,
    },
    content: {
        padding: "5px 0",
    },
    flex: {
        display: "flex",
    },
    alignCenter: {
        alignItems: "center",
    },
    date: {
        color: "#aaa",
        fontSize: 10,
        marginLeft: 10,
    },
    moreIconBtn: {
        color: ColorEnum.Grey,
        cursor: "pointer",
        marginLeft: "auto",
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: "center",
        borderRadius: 6,

        "&:hover": {
            backgroundColor: ColorEnum.LightGrey,
        },
    },
});
