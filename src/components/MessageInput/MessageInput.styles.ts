import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
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
    blueIcon: {
        color: ColorEnum.Blue,
        width: 30,
        marginTop: 10,
    },
    emojiSelect: {
        bottom: 50,
    },
});
