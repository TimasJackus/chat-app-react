import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    pickerWrapper: {
        padding: 10,
        background: ColorEnum.White,
        marginLeft: 10,
        borderTopWidth: 1,
        borderTopColor: ColorEnum.BorderGrey,
        borderTopStyle: "solid",
        display: "flex",
        alignItems: "center",
    },
    iconBtn: {
        padding: 3,
        marginRight: 10,
        alignItems: "center",
    },
    count: {
        marginLeft: 5,
    },
    emoji: {
        margin: "0 5px",
        display: "flex",
        alignItems: "center",
    },
});
