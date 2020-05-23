import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    flex: {
        // display: "flex",
    },
    inputWrapper: {
        display: "flex",
        background: ColorEnum.White,
        border: 4,
    },
    input: {
        fontSize: 13,
        padding: 10,
        flex: 1,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: ColorEnum.BorderGrey,
    },
    blueIcon: {
        color: ColorEnum.Blue,
        width: 30,
        marginTop: 10,
        cursor: "pointer",
    },
    grey: {
        color: ColorEnum.Grey,
    },
    emojiSelect: {
        bottom: 50,
    },
});
