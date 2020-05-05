import { createUseStyles } from "react-jss";
import { ColorEnum } from "../../types/enums/ColorEnum";

export const useStyles = createUseStyles({
    input: {
        background: ColorEnum.White,
        fontSize: 13,
        border: 4,
        padding: 10,
    },
    blueIcon: {
        color: ColorEnum.Blue,
    },
});
